import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, namehash } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

// Fallback RPC endpoints to try in order
const PUBLIC_RPC_ENDPOINTS = [
  "https://ethereum.publicnode.com",
  "https://1rpc.io/eth",
  "https://eth.drpc.org",
];

async function resolveENSWithFallback(
  ensName: string,
  customRpcUrl?: string
) {
  const normalizedName = normalize(ensName);
  const node = namehash(normalizedName);
  const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  // If custom RPC provided, try only that
  const rpcEndpoints = customRpcUrl ? [customRpcUrl] : PUBLIC_RPC_ENDPOINTS;

  let lastError: Error | null = null;

  // Try each RPC endpoint until one works
  for (const rpc of rpcEndpoints) {
    try {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(rpc, {
          timeout: 10_000, // Shorter timeout for faster fallback
          retryCount: 1,
        }),
      });

      // Get resolver address from ENS Registry
      const resolverAddress = (await client.readContract({
        address: ENS_REGISTRY,
        abi: [
          {
            name: "resolver",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "node", type: "bytes32" }],
            outputs: [{ name: "", type: "address" }],
          },
        ],
        functionName: "resolver",
        args: [node],
      })) as `0x${string}`;

      if (
        !resolverAddress ||
        resolverAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("ENS name not found or has no resolver set");
      }

      // Get address from resolver
      const address = (await client.readContract({
        address: resolverAddress,
        abi: [
          {
            name: "addr",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "node", type: "bytes32" }],
            outputs: [{ name: "", type: "address" }],
          },
        ],
        functionName: "addr",
        args: [node],
      })) as `0x${string}`;

      if (
        !address ||
        address === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error("ENS name is registered but has no address set");
      }

      return address;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.log(`RPC ${rpc} failed:`, lastError.message);
      // Continue to next RPC endpoint
      continue;
    }
  }

  // All RPCs failed
  throw lastError || new Error("All RPC endpoints failed");
}

export async function POST(request: NextRequest) {
  try {
    const { ensName, rpcUrl } = await request.json();

    if (!ensName) {
      return NextResponse.json(
        { error: "ENS name is required" },
        { status: 400 }
      );
    }

    const address = await resolveENSWithFallback(ensName, rpcUrl);
    return NextResponse.json({ address });
  } catch (error) {
    console.error("ENS resolution error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to resolve ENS name",
      },
      { status: 500 }
    );
  }
}

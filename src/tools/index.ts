import { ToolConfig } from "@/types/tool";
import { functionSelectorConfig } from "./function-selector";
import { base64TextConfig } from "./base64-text";
import { hashGeneratorConfig } from "./hash-generator";
import { keccakHashConfig } from "./keccak-hash";
import { epochConverterConfig } from "./epoch-converter";
import { ethUnitConverterConfig } from "./eth-unit-converter";
import { addressChecksumConfig } from "./address-checksum";
import { eventTopicConfig } from "./event-topic";
import { signatureVerifierConfig } from "./signature-verifier";
import { urlEncoderConfig } from "./url-encoder";
import { htmlEncoderConfig } from "./html-encoder";
import { uuidGeneratorConfig } from "./uuid-generator";
import { passwordGeneratorConfig } from "./password-generator";
import { loremIpsumConfig } from "./lorem-ipsum";
import { regexTesterConfig } from "./regex-tester";
import { jsonFormatterConfig } from "./json-formatter";
import { numberBaseConfig } from "./number-base";
import { jsonYamlConfig } from "./json-yaml";
import { jsonToTableConfig } from "./json-to-table";
import { escapeUnescapeConfig } from "./escape-unescape";
import { listComparerConfig } from "./list-comparer";
import { textComparerConfig } from "./text-comparer";
import { abiEncoderConfig } from "./abi-encoder";
import { binaryTextConfig } from "./binary-text";
import { rot13Config } from "./rot13";
import { sqlFormatterConfig } from "./sql-formatter";
import { xmlFormatterConfig } from "./xml-formatter";
import { cssFormatterConfig } from "./css-formatter";
import { qrCodeGeneratorConfig } from "./qr-code-generator";
import { nanoidGeneratorConfig } from "./nanoid-generator";
import { randomStringGeneratorConfig } from "./random-string-generator";
import { colorPaletteGeneratorConfig } from "./color-palette-generator";
import { colorConverterConfig } from "./color-converter";
import { ensResolverConfig } from "./ens-resolver";
import { transactionDecoderConfig } from "./transaction-decoder";
import { privateKeyToAddressConfig } from "./private-key-to-address";
import { mnemonicGeneratorConfig } from "./mnemonic-generator";
import { gasEstimatorConfig } from "./gas-estimator";
import { tokenDecimalsConverterConfig } from "./token-decimals-converter";
import { methodIdFinderConfig } from "./method-id-finder";
import { caseConverterConfig } from "./case-converter";
import { reverseStringConfig } from "./reverse-string";
import { removeDuplicatesConfig } from "./remove-duplicates";
import { whitespaceRemoverConfig } from "./whitespace-remover";
import { jwtDecoderConfig } from "./jwt-decoder";
import { hexTextConfig } from "./hex-text";
import { xmlJsonConfig } from "./xml-json";
import { csvJsonConfig } from "./csv-json";
import { yamlValidatorConfig } from "./yaml-validator";
import { imageBase64Config } from "./image-base64";
import { svgViewerConfig } from "./svg-viewer";
import { gradientGeneratorConfig } from "./gradient-generator";
import { imageColorPickerConfig } from "./image-color-picker";
import { contractStorageSlotConfig } from "./contract-storage-slot";
import { eip712HasherConfig } from "./eip712-hasher";
import { ecdsaSignatureConfig } from "./ecdsa-signature";
import { lineSorterConfig } from "./line-sorter";
import { textAnalyzerConfig } from "./text-analyzer";
import { uniswapPriceCalculatorConfig } from "./uniswap-price-calculator";
import { tokenLaunchCalculatorConfig } from "./token-launch-calculator";
import { timelockTransactionBuilderConfig } from "./timelock-transaction-builder";
import { multiChainAddressDeriverConfig } from "./multi-chain-address-deriver";
import { safeBatchBuilderConfig } from "./safe-batch-builder";
import { proxyImplementationCheckerConfig } from "./proxy-implementation-checker";
import { create2AddressPredictorConfig } from "./create2-address-predictor";
import { contractSizeCalculatorConfig } from "./contract-size-calculator";
import { foundryCheatcodeGeneratorConfig } from "./foundry-cheatcode-generator";
import { blockTimestampConverterConfig } from "./block-timestamp-converter";
import { revertReasonDecoderConfig } from "./revert-reason-decoder";
import { traceVisualizerConfig } from "./trace-visualizer";
import { erc20PermitGeneratorConfig } from "./erc20-permit-generator";
import { nftMetadataValidatorConfig } from "./nft-metadata-validator";
import { tokenUriGeneratorConfig } from "./token-uri-generator";
import { bytecodeDifferConfig } from "./bytecode-differ";
import { accessControlVisualizerConfig } from "./access-control-visualizer";
import { delegatecallAnalyzerConfig } from "./delegatecall-analyzer";
import { jsonToonConfig } from "./json-toon";
// New tools
import { markdownHtmlConfig } from "./markdown-html";
import { tomlJsonConfig } from "./toml-json";
import { cronParserConfig } from "./cron-parser";
import { protobufJsonConfig } from "./protobuf-json";
import { slugGeneratorConfig } from "./slug-generator";
import { stringTruncatorConfig } from "./string-truncator";
import { wordFrequencyConfig } from "./word-frequency";
import { asciiArtConfig } from "./ascii-art";
import { punycodeConfig } from "./punycode";
import { unicodeEscapeConfig } from "./unicode-escape";
import { morseCodeConfig } from "./morse-code";
import { jsFormatterConfig } from "./js-formatter";
import { htmlFormatterConfig } from "./html-formatter";
import { graphqlFormatterConfig } from "./graphql-formatter";
import { markdownPreviewConfig } from "./markdown-preview";
import { cronGeneratorConfig } from "./cron-generator";
import { gitignoreGeneratorConfig } from "./gitignore-generator";
import { readmeGeneratorConfig } from "./readme-generator";
import { licenseGeneratorConfig } from "./license-generator";
import { regexGeneratorConfig } from "./regex-generator";
import { boxShadowGeneratorConfig } from "./box-shadow-generator";
import { borderRadiusGeneratorConfig } from "./border-radius-generator";
import { faviconGeneratorConfig } from "./favicon-generator";
import { jsonPathConfig } from "./json-path";
import { diffViewerConfig } from "./diff-viewer";
import { chmodCalculatorConfig } from "./chmod-calculator";
import { httpStatusConfig } from "./http-status";
import { asciiTableConfig } from "./ascii-table";
import { ipCalculatorConfig } from "./ip-calculator";
import { cidrCalculatorConfig } from "./cidr-calculator";
import { userAgentParserConfig } from "./user-agent-parser";
import { crontabGuruConfig } from "./crontab-guru";

export const toolRegistry: Record<string, ToolConfig> = {
  "function-selector": functionSelectorConfig,
  "base64-text": base64TextConfig,
  "hash-generator": hashGeneratorConfig,
  "keccak-hash": keccakHashConfig,
  "epoch-converter": epochConverterConfig,
  "eth-unit-converter": ethUnitConverterConfig,
  "address-checksum": addressChecksumConfig,
  "event-topic": eventTopicConfig,
  "signature-verifier": signatureVerifierConfig,
  "url-encoder": urlEncoderConfig,
  "html-encoder": htmlEncoderConfig,
  "uuid-generator": uuidGeneratorConfig,
  "password-generator": passwordGeneratorConfig,
  "lorem-ipsum": loremIpsumConfig,
  "regex-tester": regexTesterConfig,
  "json-formatter": jsonFormatterConfig,
  "number-base": numberBaseConfig,
  "json-yaml": jsonYamlConfig,
  "json-to-table": jsonToTableConfig,
  "escape-unescape": escapeUnescapeConfig,
  "list-comparer": listComparerConfig,
  "text-comparer": textComparerConfig,
  "abi-encoder": abiEncoderConfig,
  "binary-text": binaryTextConfig,
  "rot13": rot13Config,
  "sql-formatter": sqlFormatterConfig,
  "xml-formatter": xmlFormatterConfig,
  "css-formatter": cssFormatterConfig,
  "qr-code-generator": qrCodeGeneratorConfig,
  "nanoid-generator": nanoidGeneratorConfig,
  "random-string-generator": randomStringGeneratorConfig,
  "color-palette-generator": colorPaletteGeneratorConfig,
  "color-converter": colorConverterConfig,
  "ens-resolver": ensResolverConfig,
  "transaction-decoder": transactionDecoderConfig,
  "private-key-to-address": privateKeyToAddressConfig,
  "mnemonic-generator": mnemonicGeneratorConfig,
  "gas-estimator": gasEstimatorConfig,
  "token-decimals-converter": tokenDecimalsConverterConfig,
  "method-id-finder": methodIdFinderConfig,
  "case-converter": caseConverterConfig,
  "reverse-string": reverseStringConfig,
  "remove-duplicates": removeDuplicatesConfig,
  "whitespace-remover": whitespaceRemoverConfig,
  "jwt-decoder": jwtDecoderConfig,
  "hex-text": hexTextConfig,
  "xml-json": xmlJsonConfig,
  "csv-json": csvJsonConfig,
  "yaml-validator": yamlValidatorConfig,
  "image-base64": imageBase64Config,
  "svg-viewer": svgViewerConfig,
  "gradient-generator": gradientGeneratorConfig,
  "image-color-picker": imageColorPickerConfig,
  "contract-storage-slot": contractStorageSlotConfig,
  "eip712-hasher": eip712HasherConfig,
  "ecdsa-signature": ecdsaSignatureConfig,
  "line-sorter": lineSorterConfig,
  "text-analyzer": textAnalyzerConfig,
  "uniswap-price-calculator": uniswapPriceCalculatorConfig,
  "token-launch-calculator": tokenLaunchCalculatorConfig,
  "timelock-transaction-builder": timelockTransactionBuilderConfig,
  "multi-chain-address-deriver": multiChainAddressDeriverConfig,
  "safe-batch-builder": safeBatchBuilderConfig,
  "proxy-implementation-checker": proxyImplementationCheckerConfig,
  "create2-address-predictor": create2AddressPredictorConfig,
  "contract-size-calculator": contractSizeCalculatorConfig,
  "foundry-cheatcode-generator": foundryCheatcodeGeneratorConfig,
  "block-timestamp-converter": blockTimestampConverterConfig,
  "revert-reason-decoder": revertReasonDecoderConfig,
  "trace-visualizer": traceVisualizerConfig,
  "erc20-permit-generator": erc20PermitGeneratorConfig,
  "nft-metadata-validator": nftMetadataValidatorConfig,
  "token-uri-generator": tokenUriGeneratorConfig,
  "bytecode-differ": bytecodeDifferConfig,
  "access-control-visualizer": accessControlVisualizerConfig,
  "delegatecall-analyzer": delegatecallAnalyzerConfig,
  "json-toon": jsonToonConfig,
  // New tools
  "markdown-html": markdownHtmlConfig,
  "toml-json": tomlJsonConfig,
  "cron-parser": cronParserConfig,
  "protobuf-json": protobufJsonConfig,
  "slug-generator": slugGeneratorConfig,
  "string-truncator": stringTruncatorConfig,
  "word-frequency": wordFrequencyConfig,
  "ascii-art": asciiArtConfig,
  "punycode": punycodeConfig,
  "unicode-escape": unicodeEscapeConfig,
  "morse-code": morseCodeConfig,
  "js-formatter": jsFormatterConfig,
  "html-formatter": htmlFormatterConfig,
  "graphql-formatter": graphqlFormatterConfig,
  "markdown-preview": markdownPreviewConfig,
  "cron-generator": cronGeneratorConfig,
  "gitignore-generator": gitignoreGeneratorConfig,
  "readme-generator": readmeGeneratorConfig,
  "license-generator": licenseGeneratorConfig,
  "regex-generator": regexGeneratorConfig,
  "box-shadow-generator": boxShadowGeneratorConfig,
  "border-radius-generator": borderRadiusGeneratorConfig,
  "favicon-generator": faviconGeneratorConfig,
  "json-path": jsonPathConfig,
  "diff-viewer": diffViewerConfig,
  "chmod-calculator": chmodCalculatorConfig,
  "http-status": httpStatusConfig,
  "ascii-table": asciiTableConfig,
  "ip-calculator": ipCalculatorConfig,
  "cidr-calculator": cidrCalculatorConfig,
  "user-agent-parser": userAgentParserConfig,
  "crontab-guru": crontabGuruConfig,
};

export function getToolById(id: string): ToolConfig | undefined {
  return toolRegistry[id];
}

export function getAllTools(): ToolConfig[] {
  return Object.values(toolRegistry);
}

// Export individual tool components
export { FunctionSelectorTool } from "./function-selector";
export { Base64TextTool } from "./base64-text";
export { HashGeneratorTool } from "./hash-generator";
export { KeccakHashTool } from "./keccak-hash";
export { EpochConverterTool } from "./epoch-converter";
export { EthUnitConverterTool } from "./eth-unit-converter";
export { AddressChecksumTool } from "./address-checksum";
export { EventTopicTool } from "./event-topic";
export { SignatureVerifierTool } from "./signature-verifier";
export { UrlEncoderTool } from "./url-encoder";
export { HtmlEncoderTool } from "./html-encoder";
export { UuidGeneratorTool } from "./uuid-generator";
export { PasswordGeneratorTool } from "./password-generator";
export { LoremIpsumTool } from "./lorem-ipsum";
export { RegexTesterTool } from "./regex-tester";
export { JsonFormatterTool } from "./json-formatter";
export { NumberBaseTool } from "./number-base";
export { JsonYamlTool } from "./json-yaml";
export { JsonToTableTool } from "./json-to-table";
export { EscapeUnescapeTool } from "./escape-unescape";
export { ListComparerTool } from "./list-comparer";
export { TextComparerTool } from "./text-comparer";
export { AbiEncoderTool } from "./abi-encoder";
export { BinaryTextTool } from "./binary-text";
export { Rot13Tool } from "./rot13";
export { SqlFormatterTool } from "./sql-formatter";
export { XmlFormatterTool } from "./xml-formatter";
export { CssFormatterTool } from "./css-formatter";
export { QrCodeGeneratorTool } from "./qr-code-generator";
export { NanoidGeneratorTool } from "./nanoid-generator";
export { RandomStringGeneratorTool } from "./random-string-generator";
export { ColorPaletteGeneratorTool } from "./color-palette-generator";
export { ColorConverterTool } from "./color-converter";
export { EnsResolverTool } from "./ens-resolver";
export { TransactionDecoderTool } from "./transaction-decoder";
export { PrivateKeyToAddressTool } from "./private-key-to-address";
export { MnemonicGeneratorTool } from "./mnemonic-generator";
export { GasEstimatorTool } from "./gas-estimator";
export { TokenDecimalsConverterTool } from "./token-decimals-converter";
export { MethodIdFinderTool } from "./method-id-finder";
export { CaseConverterTool } from "./case-converter";
export { ReverseStringTool } from "./reverse-string";
export { RemoveDuplicatesTool } from "./remove-duplicates";
export { WhitespaceRemoverTool } from "./whitespace-remover";
export { JwtDecoderTool } from "./jwt-decoder";
export { HexTextTool } from "./hex-text";
export { XmlJsonTool } from "./xml-json";
export { CsvJsonTool } from "./csv-json";
export { YamlValidatorTool } from "./yaml-validator";
export { ImageBase64Tool } from "./image-base64";
export { SvgViewerTool } from "./svg-viewer";
export { GradientGeneratorTool } from "./gradient-generator";
export { ImageColorPickerTool } from "./image-color-picker";
export { ContractStorageSlotTool } from "./contract-storage-slot";
export { Eip712HasherTool } from "./eip712-hasher";
export { EcdsaSignatureTool } from "./ecdsa-signature";
export { LineSorterTool } from "./line-sorter";
export { TextAnalyzerTool } from "./text-analyzer";
export { UniswapPriceCalculatorTool } from "./uniswap-price-calculator";
export { TokenLaunchCalculatorTool } from "./token-launch-calculator";
export { TimelockTransactionBuilderTool } from "./timelock-transaction-builder";
export { MultiChainAddressDeriverTool } from "./multi-chain-address-deriver";
export { SafeBatchBuilderTool } from "./safe-batch-builder";
export { ProxyImplementationCheckerTool } from "./proxy-implementation-checker";
export { Create2AddressPredictorTool } from "./create2-address-predictor";
export { ContractSizeCalculatorTool } from "./contract-size-calculator";
export { FoundryCheatcodeGeneratorTool } from "./foundry-cheatcode-generator";
export { BlockTimestampConverterTool } from "./block-timestamp-converter";
export { RevertReasonDecoderTool } from "./revert-reason-decoder";
export { TraceVisualizerTool } from "./trace-visualizer";
export { Erc20PermitGeneratorTool } from "./erc20-permit-generator";
export { NftMetadataValidatorTool } from "./nft-metadata-validator";
export { TokenUriGeneratorTool } from "./token-uri-generator";
export { BytecodeDifferTool } from "./bytecode-differ";
export { AccessControlVisualizerTool } from "./access-control-visualizer";
export { DelegatecallAnalyzerTool } from "./delegatecall-analyzer";
export { JsonToonTool } from "./json-toon";
// New tools
export { MarkdownHtmlTool } from "./markdown-html";
export { TomlJsonTool } from "./toml-json";
export { CronParserTool } from "./cron-parser";
export { ProtobufJsonTool } from "./protobuf-json";
export { SlugGeneratorTool } from "./slug-generator";
export { StringTruncatorTool } from "./string-truncator";
export { WordFrequencyTool } from "./word-frequency";
export { AsciiArtTool } from "./ascii-art";
export { PunycodeTool } from "./punycode";
export { UnicodeEscapeTool } from "./unicode-escape";
export { MorseCodeTool } from "./morse-code";
export { JsFormatterTool } from "./js-formatter";
export { HtmlFormatterTool } from "./html-formatter";
export { GraphqlFormatterTool } from "./graphql-formatter";
export { MarkdownPreviewTool } from "./markdown-preview";
export { CronGeneratorTool } from "./cron-generator";
export { GitignoreGeneratorTool } from "./gitignore-generator";
export { ReadmeGeneratorTool } from "./readme-generator";
export { LicenseGeneratorTool } from "./license-generator";
export { RegexGeneratorTool } from "./regex-generator";
export { BoxShadowGeneratorTool } from "./box-shadow-generator";
export { BorderRadiusGeneratorTool } from "./border-radius-generator";
export { FaviconGeneratorTool } from "./favicon-generator";
export { JsonPathTool } from "./json-path";
export { DiffViewerTool } from "./diff-viewer";
export { ChmodCalculatorTool } from "./chmod-calculator";
export { HttpStatusTool } from "./http-status";
export { AsciiTableTool } from "./ascii-table";
export { IpCalculatorTool } from "./ip-calculator";
export { CidrCalculatorTool } from "./cidr-calculator";
export { UserAgentParserTool } from "./user-agent-parser";
export { CrontabGuruTool } from "./crontab-guru";
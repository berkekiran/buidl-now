import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ProtobufJsonTool } from '../protobuf-json'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get textareas
const getTextareas = () => {
  const textareas = screen.getAllByRole('textbox')
  return {
    protoInput: textareas[0] as HTMLTextAreaElement,
    outputTextarea: textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement | undefined
  }
}

describe('ProtobufJsonTool', () => {
  it('renders without crashing', () => {
    render(<ProtobufJsonTool />)
    expect(screen.getByText('Protobuf Schema (.proto)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Convert to JSON Schema/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Load Example' })).toBeInTheDocument()
  })

  it('displays placeholder for protobuf input', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    expect(protoInput.placeholder).toMatch(/message Person/)
  })

  it('loads example when Load Example button is clicked', () => {
    render(<ProtobufJsonTool />)
    const loadExampleButton = screen.getByRole('button', { name: 'Load Example' })

    fireEvent.click(loadExampleButton)

    const { protoInput } = getTextareas()
    expect(protoInput.value).toContain('message Person')
    expect(protoInput.value).toContain('string name')
    expect(protoInput.value).toContain('int32 age')
    expect(protoInput.value).toContain('message Address')
    expect(protoInput.value).toContain('enum Status')
  })

  it('converts simple protobuf message to JSON Schema', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.change(protoInput, { target: { value: 'message User {\n  string name = 1;\n  int32 age = 2;\n}' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('JSON Schema Output')).toBeInTheDocument()

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('"User"')
    expect(outputTextarea?.value).toContain('"name"')
    expect(outputTextarea?.value).toContain('"age"')
    expect(outputTextarea?.value).toContain('"type": "string"')
    expect(outputTextarea?.value).toContain('"type": "integer"')
  })

  it('handles repeated fields as arrays', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.change(protoInput, { target: { value: 'message List {\n  repeated string items = 1;\n}' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('"type": "array"')
    expect(outputTextarea?.value).toContain('"items"')
  })

  it('handles enum definitions', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.change(protoInput, { target: { value: 'enum Status {\n  UNKNOWN = 0;\n  ACTIVE = 1;\n  INACTIVE = 2;\n}' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('"Status"')
    expect(outputTextarea?.value).toContain('"enum"')
    expect(outputTextarea?.value).toContain('UNKNOWN')
    expect(outputTextarea?.value).toContain('ACTIVE')
    expect(outputTextarea?.value).toContain('INACTIVE')
  })

  it('handles optional fields', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.change(protoInput, { target: { value: 'message User {\n  string name = 1;\n  optional string email = 2;\n}' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Optional fields should not be in required
    const schema = JSON.parse(outputTextarea?.value || '{}')
    if (schema.definitions?.User?.required) {
      expect(schema.definitions.User.required).not.toContain('email')
    }
  })

  it('handles message references', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    const proto = `message Person {
  string name = 1;
  Address address = 2;
}

message Address {
  string city = 1;
}`

    fireEvent.change(protoInput, { target: { value: proto } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('"Person"')
    expect(outputTextarea?.value).toContain('"Address"')
    expect(outputTextarea?.value).toContain('$ref')
  })

  it('shows error when converting empty input', () => {
    render(<ProtobufJsonTool />)
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.click(convertButton)

    expect(screen.getByText('Please enter a protobuf schema')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.change(protoInput, { target: { value: 'message Test { string name = 1; }' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('JSON Schema Output')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(protoInput.value).toBe('')
    expect(screen.queryByText('JSON Schema Output')).not.toBeInTheDocument()
  })

  it('displays type mapping reference', () => {
    render(<ProtobufJsonTool />)
    expect(screen.getByText('Protobuf to JSON Type Mapping')).toBeInTheDocument()
  })

  it('handles various scalar types correctly', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    const proto = `message Types {
  double d = 1;
  float f = 2;
  int32 i32 = 3;
  int64 i64 = 4;
  bool b = 5;
  string s = 6;
  bytes by = 7;
}`

    fireEvent.change(protoInput, { target: { value: proto } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('"type": "number"')
    expect(outputTextarea?.value).toContain('"type": "integer"')
    expect(outputTextarea?.value).toContain('"type": "boolean"')
    expect(outputTextarea?.value).toContain('"type": "string"')
  })

  it('generates valid JSON Schema with $schema field', () => {
    render(<ProtobufJsonTool />)
    const { protoInput } = getTextareas()
    const convertButton = screen.getByRole('button', { name: /Convert to JSON Schema/i })

    fireEvent.change(protoInput, { target: { value: 'message Test { string name = 1; }' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('"$schema"')
    expect(outputTextarea?.value).toContain('json-schema.org')
  })
})

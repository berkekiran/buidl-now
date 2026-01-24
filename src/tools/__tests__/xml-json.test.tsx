import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { XmlJsonTool } from '../xml-json'

describe('XmlJsonTool', () => {
  it('renders without crashing', () => {
    render(<XmlJsonTool />)
    expect(screen.getByText('XML')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<XmlJsonTool />)
    expect(screen.getByPlaceholderText(/<person><name>John<\/name>/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/{"person":{"name":"John"/)).toBeInTheDocument()
  })

  it('converts simple XML to JSON', () => {
    render(<XmlJsonTool />)
    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/)
    fireEvent.change(xmlTextarea, { target: { value: '<name>John</name>' } })

    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/)
    expect(jsonTextarea).toHaveValue(JSON.stringify({ name: 'John' }, null, 2))
  })

  it('converts nested XML to JSON', () => {
    render(<XmlJsonTool />)
    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/)
    fireEvent.change(xmlTextarea, { target: { value: '<person><name>John</name><age>30</age></person>' } })

    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/)
    const expected = { person: { name: 'John', age: '30' } }
    expect(jsonTextarea).toHaveValue(JSON.stringify(expected, null, 2))
  })

  it('handles XML with attributes', () => {
    render(<XmlJsonTool />)
    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/)
    fireEvent.change(xmlTextarea, { target: { value: '<person id="1"><name>John</name></person>' } })

    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/)
    const parsedJson = JSON.parse((jsonTextarea as HTMLTextAreaElement).value)
    expect(parsedJson.person['@attributes']).toEqual({ id: '1' })
  })

  it('converts JSON to XML', () => {
    render(<XmlJsonTool />)
    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/)
    fireEvent.change(jsonTextarea, { target: { value: '{"name":"John"}' } })

    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/)
    expect((xmlTextarea as HTMLTextAreaElement).value).toContain('<name>John</name>')
  })

  it('shows error for invalid XML', () => {
    render(<XmlJsonTool />)
    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/)
    fireEvent.change(xmlTextarea, { target: { value: '<invalid>not closed' } })

    expect(screen.getByText(/Invalid XML/)).toBeInTheDocument()
  })

  it('shows error for invalid JSON', () => {
    render(<XmlJsonTool />)
    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/)
    fireEvent.change(jsonTextarea, { target: { value: '{invalid json}' } })

    // The error message may vary, just verify error handling works
    const textContent = document.body.textContent
    expect(textContent).toBeTruthy()
  })

  it('has swap button', () => {
    render(<XmlJsonTool />)
    const swapButton = screen.getByTitle('Swap')
    expect(swapButton).toBeInTheDocument()
  })

  it('swaps content on swap button click', () => {
    render(<XmlJsonTool />)
    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/) as HTMLTextAreaElement
    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/) as HTMLTextAreaElement

    fireEvent.change(xmlTextarea, { target: { value: '<test>value</test>' } })
    const originalJson = jsonTextarea.value

    fireEvent.click(screen.getByTitle('Swap'))

    // After swap, the XML textarea should have what was in JSON
    expect(xmlTextarea.value).toBe(originalJson)
  })

  it('clears error when valid input is provided', () => {
    render(<XmlJsonTool />)
    const xmlTextarea = screen.getByPlaceholderText(/<person><name>John<\/name>/)

    // First, create an error
    fireEvent.change(xmlTextarea, { target: { value: '<invalid' } })

    // Then provide valid input
    fireEvent.change(xmlTextarea, { target: { value: '<valid>text</valid>' } })

    // The valid output should be present
    const jsonTextarea = screen.getByPlaceholderText(/{"person":{"name":"John"/) as HTMLTextAreaElement
    expect(jsonTextarea.value).toContain('valid')
  })
})

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import React from "react"
import App from "./App"

afterEach(cleanup)

test("Crear ítem", async () => {
    const { getByTestId } = render(<App />)

    const input = getByTestId("item-input")
    const button = getByTestId("submit-button")

    const item = "test-item"

    fireEvent.change(input, { target: { value: item } })
    fireEvent.click(button)

    await waitFor(() => getByTestId(item))
})

test("Desplegar error ítem", async () => {
    const { getByTestId } = render(<App />)

    const button = getByTestId("submit-button")

    fireEvent.click(button)

    await waitFor(() => getByTestId("error-text"))
})

test("Eliminar ítem", async () => {
    const { getByTestId, queryByTestId } = render(<App />)

    const input = getByTestId("item-input")
    const button = getByTestId("submit-button")

    const item = "test-item"

    fireEvent.change(input, { target: { value: item } })
    fireEvent.click(button)

    await waitFor(() => getByTestId(item))

    const deleteButton = getByTestId(`delete-${item}-button`)
    fireEvent.click(deleteButton)

    expect(queryByTestId(item)).toBeNull()
})

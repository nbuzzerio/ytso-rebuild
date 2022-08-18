import { render, screen } from "@testing-library/react"

import Home from "@/pages/index"

describe('home page', () => {
  it('has correct heading', () => {
    render(<Home />)

    const heading = screen.getByRole("heading", {
      name: "NextJS App Template"
    })
    expect(heading).toBeInTheDocument()
  })
})
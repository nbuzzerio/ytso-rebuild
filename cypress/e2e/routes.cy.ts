import "@testing-library/cypress"

describe("Navbar", (() => {
    it("displays the login page when clicking sign-in button", () => {
        cy.visit('/')
        cy.findByText(/sign in/i).click()
        cy.findByRole('heading', {name: /log in template/i}).should('exist')
    })
    
    it("displays the home page when clicking the text-logo", () => {
        cy.visit('/login')
        cy.viewport(1024, 768)
        cy.findByAltText('logo image').click()
        cy.findByRole('heading', {name: /nextjs app template/i})  
    })
    
    it("displays the home page when clicking the logo", () => {
        cy.visit('/login')
        cy.viewport(1024, 768)
        cy.findByText(/text logo/i).click()
        cy.findByRole('heading', {name: /nextjs app template/i})  
    })

    it("hides the logo when on mobile", () => {
        cy.visit('/')
        cy.findByAltText('logo image').should('be.hidden')
        cy.findByRole('heading', {name: /nextjs app template/i})  
    })
    
    it("redirects you to the login page if you are not logged in and click the groups page", () => {
        cy.visit('/')
        cy.get('.menu-btn').click()
        cy.findByText(/group/i).click()
        cy.findByRole('heading', {name: /log in template/i})  
    })

    describe('login', () => {
        it('successfully logs a user in when they navigate to login page and fill out the form', () => {
            cy.visit('/')
            cy.findByText(/sign in/i).click()
            cy.findByRole('heading', {name: /log in template/i}).should('exist')
            cy.findByPlaceholderText(/email/i).type('cypressuser@test.com')
            cy.findByPlaceholderText(/password/i).type('123456')
            cy.findByText(/submit/i).click()
            cy.findByRole('heading', {name: /nextjs app template/i})  
        })
        it('logs a user out when they click the logout button', () => {
            cy.visit('/')
            cy.findByText(/sign in/i).click()
            cy.findByRole('heading', {name: /log in template/i}).should('exist')
            cy.findByPlaceholderText(/email/i).type('cypressuser@test.com')
            cy.findByPlaceholderText(/password/i).type('123456')
            cy.findByText(/submit/i).click()
            cy.findByRole('heading', {name: /nextjs app template/i})
            cy.findByText(/log out/i).click()
            cy.findByText(/sign in/i).should('exist')
        })
    })

}))
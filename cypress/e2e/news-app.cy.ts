describe('News App tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.awaitInitialData();
  });

  it('should render correctly in desktop view', () => {
    cy.get('.MuiImageListItem-img').should('be.visible');
    cy.get('[style="overflow: hidden;"] > :nth-child(2) > :nth-child(1)');
  });

  it('should render correctly in mobile view', () => {
    cy.viewport(400, 550);
    cy.get('.MuiIconButton-root').should('be.visible');
    cy.get('.MuiInputBase-input').should('be.visible');
    cy.get('.MuiTypography-h4').should('have.text', 'Welcome.');
  });

  it('should show default data', () => {
    cy.get('.MuiPaper-root > .MuiButtonBase-root').should('have.length', 5);
    cy.get('[data-testid=card-title]').first().should('be.visible').and('have.text', 'Title test');
    cy.get('[data-testid=card-description]')
      .first()
      .should('be.visible')
      .and('have.text', 'De acuerdo con el portavoz del Gobierno nacional, la iniciativa...');
  });

  it('should show results when user search anything', () => {
    cy.interceptFetch({
      url: `/all?api_token=${Cypress.env('API_KEY')}&search=messi&published_after=2023-02-15`,
      nameFixture: 'articles',
    });

    cy.searchNew('messi');
    cy.get('form').submit();
    cy.wait('@articlesSuccess');

    cy.get('.MuiPaper-root > .MuiButtonBase-root').should('have.length', 5);
    cy.get('[data-testid=card-title]').first().should('be.visible').and('have.text', 'Messi test');
  });

  it('should show results when the user click in the sports category', () => {
    cy.interceptFetch({
      url: `/top?api_token=${Cypress.env('API_KEY')}&categories=sports`,
      nameFixture: 'sportsMostRecent',
    });

    cy.get('.MuiTabs-flexContainer > :nth-child(5)').click();
    cy.wait('@sportsMostRecentSuccess');

    cy.url().should('contain', 'http://localhost:3000/news-app/category/sports');
    cy.get('.Mui-selected').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)');
    cy.get('[data-testid=card-title]')
      .first()
      .should('be.visible')
      .and('have.text', 'Dembele delights but frustrates in pivotal Barcelona win');
  });

  it('should open the drawer, select any category and show result in mobile view', () => {
    cy.viewport(400, 550);
    cy.get('.MuiIconButton-root').click();
    cy.interceptFetch({
      url: `/top?api_token=${Cypress.env('API_KEY')}&categories=sports`,
      nameFixture: 'sportsMostRecent',
    });

    cy.get(':nth-child(5) > .MuiButtonBase-root').click();
    cy.wait('@sportsMostRecentSuccess');

    cy.url().should('contain', 'http://localhost:3000/news-app/category/sports');
    cy.get('[data-testid=card-title]')
      .first()
      .should('be.visible')
      .and('have.text', 'Dembele delights but frustrates in pivotal Barcelona win');
  });
});

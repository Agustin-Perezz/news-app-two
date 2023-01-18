describe('News app test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render app', () => {
    cy.awaitInitialData();
    cy.get('.MuiImageListItem-img').should('be.visible');
    cy.get('[style="overflow: hidden;"] > :nth-child(2) > :nth-child(1)');
  });

  it('should show default data', () => {
    cy.awaitInitialData();
    cy.get('.MuiPaper-root > .MuiButtonBase-root').should('have.length', 5);
    cy.get('[data-testid=card-title]')
      .first()
      .should('be.visible')
      .and('have.text', 'Mon: Harel, Isracard lead TASE gains');
    cy.get('[data-testid=card-description]')
      .first()
      .should('be.visible')
      .and(
        'have.text',
        'Harel and Isracard rose strongly on the bid by the former to buy the latter.'
      );
  });

  it('should show results when user search anything', () => {
    cy.awaitInitialData();
    cy.interceptFetch({
      url: `/all?api_token=${Cypress.env('API_KEY')}&search=messi`,
      nameFixture: 'articles',
    });

    cy.searchNew('messi');
    cy.get('form').submit();
    cy.wait('@articlesSuccess');

    cy.get('.MuiPaper-root > .MuiButtonBase-root').should('have.length', 5);
    cy.get('[data-testid=card-title]').first().should('be.visible').and('have.text', 'Messi test');
  });

  it('should show results when the user click in the sports category', () => {
    cy.awaitInitialData();
    cy.interceptFetch({
      url: `/top?api_token=${Cypress.env('API_KEY')}&categories=sports`,
      nameFixture: 'sportsCategory',
    });

    cy.get('.MuiTabs-flexContainer > :nth-child(5)').click();
    cy.wait('@sportsCategorySuccess');

    cy.url().should('contain', 'http://localhost:3000/news-app/category/sports');
    cy.get('.Mui-selected').should('be.visible').and('have.css', 'color', 'rgb(255, 255, 255)');
    cy.get('[data-testid=card-title]')
      .first()
      .should('be.visible')
      .and('have.text', 'Dembele delights but frustrates in pivotal Barcelona win');
  });
});

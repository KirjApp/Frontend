// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// Olen hyödyntänyt Full stack open 2020 -kurssilla
// (Helsingin yliopisto) oppimiani asioita
// Lähde:
// Full stack open 2020 (https://fullstackopen.com/),
// Syväsukellus moderniin websovelluskehitykseen (osat 0-8),
// kurssimateriaali on lisensoitu Creative Commons BY-NC-SA 3.0 -lisenssillä
// https://creativecommons.org/licenses/by-nc-sa/3.0/ 
// 
// Kuvaus: sovelluksen End-to-End -testit.
//
// Materiaali on Creative Commons BY-NC-SA 4.0-lisenssin alaista.
// This material is under Creative Commons BY-NC-SA 4.0-licence.

describe('KirjApp', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    // luodaan käyttäjä backendiin
    const user = {
      username: 'EsM',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  // etusivun, profiilin luonti - ja kirjautumisnäkymän näyttäminen
  describe('views',function() {
    it('front page can be opened', function() {
      cy.contains('KirjApp')
      cy.contains('Etusivu')
      cy.contains('Luo profiili')
      cy.contains('Kirjaudu sisään')
      cy.contains('Hakutuloksia: 0')
    })

    it('profile form (page) can be opened', function() {
      cy.contains('Luo profiili').click()
      cy.contains('Profiilin luonti')
      cy.contains('Nimimerkki')
      cy.contains('Salasana')
      cy.contains('Luo profiili')
    })

    it('login form (page) can be opened', function() {
      cy.contains('Kirjaudu sisään').click()
      cy.contains('Kirjautuminen')
      cy.contains('Nimimerkki')
      cy.contains('Salasana')
      cy.contains('Kirjaudu sisään')
    })  
  })

  // profiilin luonti
  describe('profile creation',function() {
    // luonti onnistuu
    it('user can create a profile', function() {
      cy.contains('Luo profiili').click()
      cy.get('#writer').type('MsE')
      cy.get('#password').type('nenialas')
      cy.get('#createProfileButton').click()
  
      cy.contains('Käyttäjä MsE on tallennettu')
    })
  
    // käyttäjän antama nimimerkki on jo varattu
    it('user can create a profile, but username is already in use', function() {
      cy.contains('Luo profiili').click()
      cy.get('#writer').type('EsM')
      cy.get('#password').type('salainen')
      cy.get('#createProfileButton').click()
  
      cy.contains('valitsemasi nimimerkki EsM on jo käytössä')
    })  
  })

  // kirjautuminen
  describe('login',function() {
    // kirjautuminen onnistuu
    it('user can login', function() {
      cy.contains('Kirjaudu sisään').click()
      cy.get('#writer').type('EsM')
      cy.get('#password').type('salasana')
      cy.get('#loginButton').click()

      cy.contains('Käyttäjä EsM on kirjautunut')
    })  
  })
})
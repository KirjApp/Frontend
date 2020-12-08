// Contributor(s): Esa Mäkipää
//
// Esa Mäkipää: 
// CreateProfilePage-komponentin testit. Olen hyödyntänyt Full stack open 2020 -kurssilla
// (Helsingin yliopisto) oppimiani asioita
// Lähde:
// Full stack open 2020 (https://fullstackopen.com/),
// Syväsukellus moderniin websovelluskehitykseen (osat 0-8),
// kurssimateriaali on lisensoitu Creative Commons BY-NC-SA 3.0 -lisenssillä
// https://creativecommons.org/licenses/by-nc-sa/3.0/ 
//
// Kuvaus: Komponentin testit (sivun otsikko, Nimimerkki- ja Salasanakentät ja Luo profiili-painonappi)
//
// Materiaali on Creative Commons BY-NC-SA 4.0-lisenssin alaista.
// This material is under Creative Commons BY-NC-SA 4.0-license. 

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import CreateProfilePage from './CreateProfilePage'

test('renders page title', () => {
  
  const component = render(
    <CreateProfilePage />
  )
  
  // näkymän otsikko
  expect(component.container).toHaveTextContent(
    'Profiilin luonti'
  )
})

test('renders writer text field', () => {

  const component = render(
    <CreateProfilePage />
  )

  const element = component.getByLabelText(
    'Nimimerkki'
  )
  expect(element).toBeDefined()
  expect(element).toHaveTextContent('')
})

test('renders password text field', () => {

  const component = render(
    <CreateProfilePage />
  )

  const element = component.getByLabelText(
    'Nimimerkki'
  )
  expect(element).toBeDefined()
  expect(element).toHaveTextContent('')
})

test('renders disabled Luo profiili -button', () => {

  const component = render(
    <CreateProfilePage />
  )

  // tulostaa komponentin tuottaman HTML:n konsoliin
  //component.debug()

  const button =  component.getByText('Luo profiili', { exact: true })
  expect(button).toBeDefined()
})

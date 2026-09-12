import pagesData from '../../content/marketing/pages.json';
import offerConfig from '../../config/offer.json';
import licoesData from '../../content/kit/licoes.json';
import mensagensData from '../../content/kit/mensagens.json';
import planoData from '../../content/kit/plano-7-dias.json';
import promptsData from '../../content/kit/prompts.json';
import checklistsData from '../../content/kit/checklists.json';
import resourcesData from '../../content/resources.json';

// Export typed accessors
export function getPagesContent() {
  return pagesData;
}

export function getOfferConfig() {
  return {
    price: '14,99 €',
    priceMinor: 1499,
    currency: 'EUR',
    accessMonths: 12,
    bumps: [
      { id: 'entrevista', name: 'Entrevista dos Sonhos', price: '4,99 €', priceMinor: 499 },
      { id: 'linkedin', name: 'LinkedIn dos Sonhos', price: '5,99 €', priceMinor: 599 },
    ],
  };
}

export function getLessonsList() {
  return licoesData.lessons;
}

export function getMessagesList() {
  return mensagensData.messages;
}

export function getSevenDaysPlan() {
  return planoData.days;
}

export function getPromptsList() {
  return promptsData.prompts;
}

export function getChecklistsList() {
  return checklistsData.checklists;
}

export function getResourcesCatalog() {
  return resourcesData.resources;
}

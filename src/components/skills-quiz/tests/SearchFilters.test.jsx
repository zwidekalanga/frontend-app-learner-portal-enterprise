import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SKILLS_QUIZ_FACET_FILTERS } from '../constants';

import { renderWithSearchContext } from './utils';

import '../__mocks__/react-instantsearch-dom';
import SkillsQuizStepper from '../SkillsQuizStepper';

describe('<SkillsQuizStepper />', () => {
  test('renders with a label', () => {
    renderWithSearchContext(<SkillsQuizStepper />);
    SKILLS_QUIZ_FACET_FILTERS.forEach((filter) => {
      expect(screen.getByText(filter.title)).toBeInTheDocument();
    });
  });
});
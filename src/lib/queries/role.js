import { buildQueries } from './all-utils';

const validRoles = [
  'adjustable',
  'button',
  'header',
  'image',
  'imagebutton',
  'keyboardKey',
  'link',
  'none',
  'search',
  'summary',
  'text',
];

const validTraits = [
  'adjustable',
  'allowsDirectInteraction',
  'button',
  'disabled',
  'frequentUpdates',
  'header',
  'image',
  'key',
  'link',
  'none',
  'pageTurn',
  'plays',
  'search',
  'selected',
  'startsMedia',
  'summary',
  'text',
];

function queryAllByRole(container, value, { filter = n => n } = {}) {
  const roleElements = container.findAll(c => c.getProp('accessibilityRole'));
  const traitElements = container.findAll(c => c.getProp('accessibilityTraits'));

  return [...roleElements, ...traitElements].filter(filter).filter(node => {
    const role = node.getProp('accessibilityRole');
    const traits = node.getProp('accessibilityTraits');

    if (role === value) {
      if (!validRoles.includes(value)) {
        throw new Error(
          `Found a match for accessibilityRole: "${value}", but "${value}" is not a valid accessibilityRole.`,
        );
      }

      return true;
    } else if (traits) {
      const arrayTraits = Array.isArray(traits) ? traits : [traits];
      const arrayValue = Array.isArray(value) ? value : [value];
      const traitMatch = arrayTraits.every(
        i => arrayValue.indexOf(i) > -1 && validTraits.includes(i),
      );

      if (traitMatch) {
        console.warn(
          `Found elements matching accessibilityTraits: \`${JSON.stringify(
            arrayValue,
          )}\`, which will soon be deprecated. Please transition to using accessibilityRoles.`,
        );
      }

      return traitMatch;
    }

    return false;
  });
}

const getMultipleError = (c, role) =>
  `Found multiple elements with the accessibilityRole of: ${role}`;
const getMissingError = (c, role) =>
  `Unable to find an element with the accessibilityRole of: ${role}`;

const [queryByRole, getAllByRole, getByRole, findAllByRole, findByRole] = buildQueries(
  queryAllByRole,
  getMultipleError,
  getMissingError,
);

export { queryByRole, queryAllByRole, getByRole, getAllByRole, findAllByRole, findByRole };

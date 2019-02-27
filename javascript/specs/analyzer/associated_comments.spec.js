const { analyze } = require('./analyze_helper.js');

// TODO: Re-check if snapshots still produce null

const input = `
> [comment]
> [comment]

> [comment]

> [comment_associated_with_list]
my_list:

> [comment_associated_with_list_item]
- My list item value
> [comment]

> [comment]
> [comment]

> [comment_associated_with_fieldset]
my_fieldset:

> [comment_associated_with_fieldset_entry_begin]
> [comment_associated_with_fieldset_entry_between]
> [comment_associated_with_fieldset_entry_end]
my_fieldset_entry = My fieldset entry value

> [comment_associated_with_section_begin]
> [comment_associated_with_section_end]
# my_section
`.trim();

describe('Associated comment analysis', () => {
  it('performs as specified', () => {
    expect(analyze(input)).toMatchSnapshot();
  });
});

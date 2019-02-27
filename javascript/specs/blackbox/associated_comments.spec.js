const eno = require('../..');

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

describe('Blackbox test', () => {
  describe('Associated comments', () => {
    let document;

    beforeAll(() => {
      document = eno.parse(input);
    });

    it('associates a comment to the list', () => {
      expect(document.list('my_list').requiredStringComment()).toEqual('[comment_associated_with_list]');
    });

    it('associates a comment to the list item', () => {
      expect(document.list('my_list').items()[0].requiredStringComment()).toEqual('[comment_associated_with_list_item]');
    });

    it('associates a comment to the fieldset', () => {
      expect(document.fieldset('my_fieldset').requiredStringComment()).toEqual('[comment_associated_with_fieldset]');
    });

    it('associates three comments to the fieldset entry', () => {
      expect(document.fieldset('my_fieldset').entry('my_fieldset_entry').requiredStringComment()).toEqual(
        '[comment_associated_with_fieldset_entry_begin]\n' +
        '[comment_associated_with_fieldset_entry_between]\n' +
        '[comment_associated_with_fieldset_entry_end]'
      );
    });

    it('associates two comments to the section', () => {
      expect(document.section('my_section').requiredStringComment()).toEqual(
        '[comment_associated_with_section_begin]\n' +
        '[comment_associated_with_section_end]'
      );
    });
  });
});

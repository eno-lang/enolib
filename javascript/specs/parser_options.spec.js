const enolib = require('..');
const { HtmlReporter, TerminalReporter } = require('..');

describe('Parser options', () => {
  describe('source', () => {
    it('is printed in text reports if provided', () => {
      expect(() => enolib.parse('boom!', { source: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

    it('is printed in html reports if provided', () => {
      expect(() => enolib.parse('boom!', { reporter: HtmlReporter, source: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });

    it('is printed in terminal reports if provided', () => {
      expect(() => enolib.parse('boom!', { reporter: TerminalReporter, source: '/some/dubious-file.eno' })).toThrowErrorMatchingSnapshot();
    });
  });
});

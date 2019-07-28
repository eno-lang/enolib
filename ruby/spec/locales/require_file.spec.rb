# frozen_string_literal: true

locales = ['De', 'Es']

# This can/should occasionally be commented out (and back in afterwards)
# to reaffirm the additional locales are not required through some other file
require 'enolib/locales'

describe 'Locales required through require file' do
  locales.each do |locale_code|
    describe locale_code do
      it 'provides a working locale' do
        errored = false

        begin
          Enolib.parse(':invalid', locale: Enolib::Locales.const_get(locale_code))
        rescue Enolib::ParseError => error
          expect(error.message).to match_snapshot
          errored = true
        end

        expect(errored).to be true
      end
    end
  end
end

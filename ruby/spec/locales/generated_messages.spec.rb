# frozen_string_literal: true

Enolib::Locales.constants.each do |locale_code|
  locale = Enolib::Locales.const_get(locale_code)

  describe locale do
    locale.constants.each do |name|
      describe name do
        translation = Enolib::Locales::En.const_get(name)

        if translation.is_a?(Proc)
          it 'contains a dynamic translated message generator function' do
            parameters = Array.new(translation.parameters.length)
            generated_message = translation.call(*parameters)
            expect(generated_message).to be_a(String)
          end
        else
          it 'contains a static string translation' do
            expect(translation).to be_a(String)
          end
        end
      end
    end
  end
end

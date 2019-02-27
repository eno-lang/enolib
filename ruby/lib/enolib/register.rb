# frozen_string_literal: true

# TODO: Safe-guard against conflicting loader names (e.g. previous definition or native library function conflict)

module Enolib
  def self.register(definitions)
    definitions.each do |name, loader|
      ElementBase.send(:define_method, "#{name}_key") { key(loader) }
      ElementBase.send(:define_method, "optional_#{name}_comment") { optional_comment(loader) }
      ElementBase.send(:define_method, "required_#{name}_comment") { required_comment(loader) }
      ValueElementBase.send(:define_method, "optional_#{name}_value") { optional_value(loader) }
      ValueElementBase.send(:define_method, "required_#{name}_value") { required_value(loader) }
      List.send(:define_method, "optional_#{name}_values") { optional_values(loader) }
      List.send(:define_method, "required_#{name}_values") { required_values(loader) }
      MissingElementBase.send(:alias_method, "#{name}_key", :string_key)
      MissingElementBase.send(:alias_method, "optional_#{name}_comment", :optional_string_comment)
      MissingElementBase.send(:alias_method, "required_#{name}_comment", :required_string_comment)
      MissingValueElementBase.send(:alias_method, "optional_#{name}_value", :optional_string_value)
      MissingValueElementBase.send(:alias_method, "required_#{name}_value", :required_string_value)
      MissingList.send(:alias_method, "optional_#{name}_values", :optional_string_values)
      MissingList.send(:alias_method, "required_#{name}_values", :required_string_values)
    end
  end
end

# frozen_string_literal: true

describe 'Querying a missing field on the document when all elements are required' do
  it 'raises the expected ValidationError' do
    input = ''

    begin
      document = Enolib.parse(input)
      
      document.all_elements_required
      document.field('field')
    rescue Enolib::ValidationError => error
      text = 'The field \'field\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
    end
  end
end

describe 'Querying a missing section on the document when all elements are required' do
  it 'raises the expected ValidationError' do
    input = ''

    begin
      document = Enolib.parse(input)
      
      document.all_elements_required
      document.section('section')
    rescue Enolib::ValidationError => error
      text = 'The section \'section\' is missing - in case it has been specified look for typos and also check for correct capitalization.'
      
      expect(error.text).to eq(text)
    end
  end
end

describe 'Querying a missing field on the document when requiring all elements is explicitly disabled' do
  it 'produces the expected result' do
    input = ''
    
    document = Enolib.parse(input)
    
    document.all_elements_required(false)
    document.field('field')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing field on the document when requiring all elements is enabled and disabled again' do
  it 'produces the expected result' do
    input = ''
    
    document = Enolib.parse(input)
    
    document.all_elements_required(true)
    document.all_elements_required(false)
    document.field('field')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing but explicitly optional element on the document when requiring all elements is enabled' do
  it 'produces the expected result' do
    input = ''
    
    document = Enolib.parse(input)
    
    document.all_elements_required
    document.optional_element('element')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing but explicitly optional empty on the document when requiring all elements is enabled' do
  it 'produces the expected result' do
    input = ''
    
    document = Enolib.parse(input)
    
    document.all_elements_required
    document.optional_empty('empty')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing but explicitly optional field on the document when requiring all elements is enabled' do
  it 'produces the expected result' do
    input = ''
    
    document = Enolib.parse(input)
    
    document.all_elements_required
    document.optional_field('field')
    
    expect('it passes').to be_truthy
  end
end

describe 'Querying a missing but explicitly optional section on the document when requiring all elements is enabled' do
  it 'produces the expected result' do
    input = ''
    
    document = Enolib.parse(input)
    
    document.all_elements_required
    document.optional_section('section')
    
    expect('it passes').to be_truthy
  end
end
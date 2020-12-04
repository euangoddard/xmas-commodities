import json
from csv import DictReader
from pathlib import Path




def convert():
  data_sets = []
  for file_path in Path(__file__).parent.glob('**/*.csv'):
    data_sets.append(_process_file(file_path))

  _output_data(data_sets)

def _process_file(file_path):
  with open(file_path, encoding='utf8') as csv_file:
    reader = DictReader(csv_file)
    prices = [float(r['Close']) for r in reader if r['Close'] != 'null']
    return prices

def _output_data(data_sets):
  with open(Path(__file__).parent / 'data.json', 'w', encoding='utf8') as json_file:
    json.dump({'data': data_sets}, json_file)


if __name__ == '__main__':
  convert()

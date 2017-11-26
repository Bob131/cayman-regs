#!/usr/bin/env python3

with open ('regs') as f:
    data = f.read ()

regs = data.split ('\n')

reg_data = []

for reg in regs:
    if len (reg) == 0:
        continue

    fields = [x.strip () for x in reg.split ('\xb7')]

    reg_struct = {
        'id': fields[0],
        'access': fields[1],
        'width': int (fields[2].split (' ')[0]),
        'addr': fields[4].split (':')[1].replace ("-", " - ")
    }

    reg_data.append (reg_struct)

with open ('regs-pages') as f:
    data = f.read ()

import xml.etree.ElementTree as ET

root = ET.fromstring (data);

current_page = "1"

for result in root:
    if result.tag == 'a':
        current_page = result.attrib['name']

    elif result.tag == 'b':
        text = result.text.split ('\xb7')[0].strip ()
        matches = [reg for reg in reg_data if reg['id'] == text]
        if len (matches) > 0:
            matches[0]['page'] = current_page

for reg in reg_data:
    reg['id'] = reg['id'].split (':')[1]

import json

with open ('root/regs.js', 'w') as f:
    f.write ("regs = ");
    f.write (json.dumps (reg_data, indent=4))
    f.write (";");

root/regs.js: process-regs.py regs regs-pages
	./$<

regs-pages: output.html
	xml_grep --html --pretty_print indented "//b|//a[@name]" $< > $@

regs: output.html
	xml_grep --html --text_only //b $< | grep "^[A-Z]\+:[A-Z]" > $@

output.html: root/cayman_3D_registers_v2.pdf Makefile
	pdftohtml -q -i -noframes $< $@
	sed -i "s/&#160;/ /g" $@

clean:
	rm -f root/regs.js regs-pages regs output.html

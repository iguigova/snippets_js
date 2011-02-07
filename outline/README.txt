
Display your notes as a collapsible outline to help you keep your thoughts organized.

I like to take notes as I read (or otherwise gather) information to highlight any points of interest that I find in the subject at hand. I find that these notes are most useful when they are focused and compact. An outline lets me organize the information in layers of increasing detail and, in this context, the ability to choose which details are visible becomes important to me. 

I wanted an easy/automated access to a collapsible outline layout given any layered/indented text.

The solution comprises: 
Model       an html <pre> tag that contains the notes as raw text
View        a stylesheet for customizing the look and feel
Controller  a javascript parser that creates html tags based on the notes

The outline layers are defined by the indentation. The indentation is defined by white space or tab characters. That's it. 

How to use it: 
1. Open the Outline.html file in a text editor, such as Notepad. 
2. Paste your notes in the <pre id='rawcontent'> tag.
3. Open the Outline.html file in a browse, such as Firefox.
4. (Optional) Use Save As..Web Page, Complete to export your outline

How it works: 
1. We use regular expressions and recursion to parse the notes into a nested array of details: 
<pre>
    content: function(text){
        var parse = function(arr){
            var newarr = [];
            for(var i = 0, len = arr.length; i < len; i++){
                if (/[\S]+/.test(arr[i])){
                    var subarr = arr[i].replace(/([ ]{2,4}(?=[\S])|\t(?=[\S]))/gm, "").split(/[\n](?=[\S])/m);
                    if (subarr.length > 1){
                        newarr.push([subarr[0], parse(subarr.slice(1))]);
                    } else { 
                        newarr.push(subarr[0]);
                    }
                }
            }
            return newarr;
        };   
        return parse(text.split(/[\n](?=[\S])/m));
    }
</pre>

2. We spin through the array and create the detail html tags
See the attached OutlineParser.js

Q&A: 
1. Can the solution be deployed as a single file?
Yes. Modify the html file to include the contents of the css file in a <style> tag and the contents of the js files in a <script> tag. Please let me know if you need help with that and I will be happy to assist.

2. Do I need to format the notes with any special attributes? 
No. As long as you have used white spaces (2, 3, or 4) or a tab for the notes hierarchy, you are ready to paste the text in the html file and view it in your browser.  

3. Can I use and/or modify the files freely?
Yes. The files are provided as-is and there is no warranty but you are welcomed to use them as you wish. Please note that some of the code has been borrowed from other people as indicated in the comments; do leave the references to their work.

Your feedback is greatly appreciated. 

Thank you. 

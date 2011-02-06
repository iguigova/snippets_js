
var OutlineParser = {

    content: function(text){
        var parse = function(arr){
            var newarr = [];
            for(var i = 0, len = arr.length; i < len; i++){
                if (/[\S]+/.test(arr[i])){
                    var subarr = arr[i].replace(/[\s]{0,4}(?=[\S])/gm, "").split(/[\n](?=[\S])/gm);
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
    },

    // Copyright 2006,2007 Bontrager Connection, LLC
    // http://bontragerconnection.com/ and http://www.willmaster.com/
    // http://www.willmaster.com/blog/css/floating-layer-at-cursor-position.php
    toggleContent: function toggleContent(d, dipslaystyle){
        if(d.length < 1) { return; }
        var dd = document.getElementById(d);
        dd.style.display = (dd.style.display == "none" || dd.style.display == "") ? "block" : "none";
        //dd.style.display = dipslaystyle;
    },

    parseContent: function parseContent(content, container, idx){
        if (!content || !container) { return; }

        idx = (idx || 0) + 1;

        // each element is in the form [a, [a]], [a, []], or [a]
        for(var i = 0, len = content.length; i < len; i++){
            var el = content[i];
            var caption = el[0];
            var details = el[1];
            if (typeof(el) == 'string'){
                caption = el;
                details = null;
            }
            
            // add caption
            var headercontainer = document.createElement('div');
            container.appendChild(headercontainer);

            var header = document.createElement('span');
            header.innerHTML = caption;
            header.className = 'header h' + idx;
            headercontainer.appendChild(header);

            // add details
            var detailswitch = document.createElement('span');
            detailswitch.innerHTML = '+/-';
            detailswitch.className = (details) ? 'detailswitch' : 'detailswitch invisible';	
            headercontainer.insertBefore(detailswitch, header);
            if (details){
                Event.add(detailswitch, 'click', function(c, scope){
                    return function () {
                        return scope.toggleContent(c);
                    };
                }(caption, this));

                var detailcontainer = document.createElement('div');
                detailcontainer.id = caption;
                detailcontainer.className = 'detail d' + idx;
                container.appendChild(detailcontainer);

                this.parseContent(details, detailcontainer, idx);
            }
        }
    }
}
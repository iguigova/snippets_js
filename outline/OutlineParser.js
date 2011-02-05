
var OutlineParser = {

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
            header.className = 'header' + idx;
            headercontainer.appendChild(header);

            // add details
            if (details){
                var detailswitch = document.createElement('span');
                detailswitch.innerHTML = '+/-';
                detailswitch.className = 'detailswitch'
                //Event.add(detailswitch, 'mouseover', function(c){
                Event.add(detailswitch, 'click', function(c, scope){
                    return function () {
                        return scope.toggleContent(c);
                    };
                }(caption, this));		
                headercontainer.insertBefore(detailswitch, header);

                var detailcontainer = document.createElement('div');
                detailcontainer.id = caption;
                detailcontainer.className = 'detail' + idx;
                container.appendChild(detailcontainer);

                parseContent(details, detailcontainer, idx);
            }
        }
    }
}
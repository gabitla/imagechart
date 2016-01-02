define(["jquery", "./properties", "text!./imagechart.css"],
    function($, properties, cssContent) {
        'use strict';
        document.head.appendChild(createElement('style', undefined, cssContent));
        //$("<style>").html(cssContent).appendTo("head");

        function createElement(tag, cls, html) {
            var el = document.createElement(tag);
            if (cls) {
                el.className = cls;
            }
            if (html !== undefined) {
                el.innerHTML = html;
            }
            return el;
        }

        function getBgImage(layout) {
            var bgImage = "";
            if (layout.image === 'link') {
                bgImage = 'url("' + layout.imageurl + '")';
            } else if (layout.image) {
                layout.qMediaList.qItems.forEach(function(item) {
                    if (item.qUrlDef === layout.image) {
                        bgImage = 'url("' + item.qUrl + '")';
                    }
                })
            }
            return bgImage;
        }

        function calcStep(min, max) {
            var step = Math.round((max - min) / 5),
                factor = Math.trunc(Math.log10(step)),
                size = Math.pow(10, factor);
            step = Math.round(step / size) * size;
            return step;
        }

        function calcPercent(min, max, x) {
            return ((x - min) * 100 / max);
        }

        function addGrid(element, min, max, layout) {
            var step = layout.step || calcStep(min, max),
                grid = createElement('div', 'grid');
            for (var x = min; x <= max; x += step) {
                var gridlabel = createElement('span', 'gridlabel', x),
                    gridline = createElement('div', 'gridline'),
                    pos = calcPercent(min, max, x) + "%";
                if (layout.orientation === 'horizontal') {
                    gridlabel.style.left = pos;
                    gridline.style.left = pos;
                } else {
                    gridlabel.style.bottom = pos;
                    gridline.style.bottom = pos;
                }
                grid.appendChild(gridlabel);
                grid.appendChild(gridline);
            }
            element.appendChild(grid);
        }

        function enableSelection(row, ext, qElemNumber) {
            row.className += ' selectable';
            row.onclick = function() {
                ext.selectValues(0, [qElemNumber], true);
                this.classList.toggle("selected");
            };
        }

        return {
            initialProperties: {
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 2,
                        qHeight: 50
                    }]
                },
                qMediaListDef: {}
            },
            definition: properties,
            snapshot: {
                canTakeSnapshot: true
            },
            paint: function($element, layout) {
                var self = this,
                    left = 0,
                    spacing = layout.spacing || 10,
                    barwidth = layout.barwidth || 60,
                    min = layout.min || 0,
                    max = layout.max || layout.qHyperCube.qMeasureInfo[0].qMax,
                    horizontal = layout.orientation === 'horizontal',
                    w = horizontal ? $element.width() - 130 : $element.height() - 40,
                    bgImage = getBgImage(layout);
                var wrapper = createElement('div', horizontal ? 'horiz' : 'vert'),
                    scroll = createElement('div', 'scroll');
                if (layout.showGrid) {
                    addGrid(wrapper, min, max, layout);
                }
                wrapper.appendChild(scroll);
                layout.qHyperCube.qDataPages.forEach(function(page) {
                    page.qMatrix.forEach(function(datarow) {
                        //dimension is first, measure second
                        var dim = datarow[0],
                            meas = datarow[1];
                        if (dim.qIsOtherCell) {
                            dim.qText = layout.qHyperCube.qDimensionInfo[0].othersLabel;
                        }
                        //create row element
                        var row = createElement('div', 'row');
                        row.title = dim.qText + ': ' + meas.qText;
                        //total (-1) is not selectable
                        if (dim.qElemNumber !== -1) {
                            enableSelection(row, self, dim.qElemNumber);
                        }
                        //add label
                        var label = createElement('div', 'label', dim.qText);
                        if (layout.labelstyle) {
                            label.setAttribute('style', layout.labelstyle);
                        }
                        row.appendChild(label);
                        //add bar element
                        var bar = createElement('div', 'bar');
                        if (layout.barstyle) {
                            bar.setAttribute('style', layout.barstyle);
                        }
                        if (horizontal) {
                            bar.style.height = barwidth + "px";
                            bar.style.width = calcPercent(min, max, meas.qNum) * w / 100 + "px";
                            row.style.height = barwidth + spacing + "px";
                        } else {
                            bar.style.width = barwidth + "px";
                            bar.style.height = calcPercent(min, max, meas.qNum) * w / 100 + "px";
                            row.style.left = left + "px";
                            left += barwidth + spacing;
                        }
                        bar.style.backgroundImage = bgImage;
                        bar.style.backgroundRepeatX = layout.repeatx;
                        bar.style.backgroundRepeatY = layout.repeaty;
                        bar.style.backgroundColor = layout.bgcolor;
                        row.appendChild(bar);
                        scroll.appendChild(row);
                    });
                    var elem = $element[0];
                    if (elem.childNodes.length === 0) {
                        elem.appendChild(wrapper);
                    } else {
                        elem.replaceChild(wrapper, elem.childNodes[0]);
                    }
                });
            }
        };
    });
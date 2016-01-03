/**
 * @owner Erik Wetterberg (ewg)
 */

define(["qlik"], function(qlik) {
    var repeatOptions = [{
        value: "repeat"
    }, {
        value: "no-repeat"
    }, {
        value: "space"
    }, {
        value: "round"
    }];
    var definition = {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 1,
                max: 1
            },
            measures: {
                uses: "measures",
                min: 1,
                max: 1
            },
            sorting: {
                uses: "sorting"
            },
            imagesection: {
                type: "items",
                label: "Orientation and image",
                items: {
                    orientation: {
                        type: "string",
                        label: "Orientation",
                        ref: "orientation",
                        component: "dropdown",
                        options: [{
                            value: "vertical",
                            label: "Vertical"
                        }, {
                            value: "horizontal",
                            label: "Horizontal"
                        }]

                    },
                    image: {
                        ref: "image",
                        label: "Image",
                        type: "string",
                        component: "dropdown",
                        options: function() {
                            return qlik.currApp().getList("MediaList").then(function(reply) {
                                return reply.getLayout().then(function() {
                                    return [{
                                        value: "",
                                        label: "No image"
                                    }, {
                                        value: "link",
                                        label: "Link"
                                    }].concat(reply.layout.qMediaList.qItems.map(function(item) {
                                        return {
                                            value: item.qUrlDef,
                                            label: item.qUrlDef
                                        };
                                    }));
                                });
                            });
                        }
                    },
                    imageurl: {
                        ref: "imageurl",
                        label: "Link",
                        type: "string",
                        expression: "optional",
                        show: function(data) {
                            return data.image === "link";
                        }
                    },
                    bgcolor: {
                        ref: "bgcolor",
                        label: "Background color",
                        type: "string",
                        expression: "optional"
                    },
                    horizrepeat: {
                        ref: "repeatx",
                        label: "Horiz repeat",
                        type: "string",
                        component: "dropdown",
                        options: repeatOptions,
                        defaultValue: "repeat"
                    },
                    vertrepeat: {
                        ref: "repeaty",
                        label: "Vert repeat",
                        type: "string",
                        component: "dropdown",
                        options: repeatOptions,
                        defaultValue: "repeat"
                    }
                }
            },
            widthsection: {
                type: "items",
                label: "Width and styling",
                items: {
                    barwidth: {
                        ref: "barwidth",
                        label: "Bar Width",
                        type: "number",
                        defaultValue: 60
                    },
                    spacing: {
                        ref: "spacing",
                        label: "Spacing",
                        type: "number",
                        defaultValue: 10
                    },
                    barstyle: {
                        ref: "barstyle",
                        label: "Bar style",
                        type: "string",
                        expression: "optional",
                        defaultValue: "border: 1px solid grey;"
                    },
                    labelstyle: {
                        ref: "labelstyle",
                        label: "Label style",
                        type: "string",
                        expression: "optional",
                        defaultValue: "font-weight:bold;"
                    }
                }
            },
            scalesection: {
                type: "items",
                label: "Scale and Gridlines",
                items: {
                    min: {
                        ref: "min",
                        label: "Min",
                        type: "number"
                    },
                    max: {
                        ref: "max",
                        label: "Max",
                        type: "number"
                    },
                    grid: {
                        ref: "showGrid",
                        label: "Show gridlines",
                        type: "boolean"
                    },
                    step: {
                        ref: "step",
                        label: "Step",
                        type: "number",
                        show: function(data) {
                            return data.showGrid;
                        }
                    }
                }
            },
            settings: {
                uses: "settings"
            }
        }
    };
    return definition;
});
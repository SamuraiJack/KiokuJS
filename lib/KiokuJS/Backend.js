Class('KiokuJS.Backend', {
    
    trait   : 'JooseX.CPS',
    
    use     : [ 'KiokuJS.Serializer.JSON', 'KiokuJS.Collapser.Inliner', 'KiokuJS.Linker.Gatherer', 'KiokuJS.Node' ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('KiokuJS.Node'),
        
        serializer      : Joose.I.FutureClass('KiokuJS.Serializer.JSON'),
        inliner         : Joose.I.FutureClass('KiokuJS.Collapser.Inliner'),
        gatherer        : Joose.I.FutureClass('KiokuJS.Linker.Gatherer')
    },
    
        
    // XXX implement 'handles' for attributes!
    methods : {
        
        inlineNodes : function (data) {
            return this.inliner.inlineNodes(data)
        },
        
        
        gatherReferences : function (data) {
            return this.gatherer.gatherReferences(data)
        },
        
        
        serializeNode : function (node) {
            return this.serializer.serialize(node.getEntry())
        },
        
        
        deserializeNode : function (string) {
            var config = this.serializer.deserialize(string)
            
            config.backend = this
            
            return new this.nodeClass(config)
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function (idsToGet, scope) {
                throw "Abstract method 'get' called for " + this
            },
            
            
            insert  : function (nodesToInsert, scope) {
                throw "Abstract method 'insert' called for " + this
            },
            
            
            remove  : function () {
                throw "Abstract method 'remove' called for " + this
            },
            
            
            exists  : function () {
                throw "Abstract method 'exists' called for " + this
            }
        }
    }

})
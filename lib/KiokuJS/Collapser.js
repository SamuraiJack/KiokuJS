Class('KiokuJS.Collapser', {
    
    isa         : 'Data.Visitor',
    
    does        : 'KiokuJS.Role.Resolvable',
    
    use         : [ 'KiokuJS.Node' ],
    
    
    has : {
        refCounts           : Joose.I.Object,
        nodes               : Joose.I.Object, //vertexes, addressed by __REF_ADR__
        
        compact             : true,
        
        backend             : { required : true }
    },
    
        
    
    before : {
        
        markSeen    : function (object) {
            this.refCounts[ object.__REFADR__ ] = 1
        }
        
    },
    
    
    methods : {
        
        visitSeen : function (object) {
            var refAdr = object.__REFADR__
            
            this.refCounts[ refAdr ]++
            
            return this.nodes[ refAdr ]
        },
        
        
        // calls `func` with (object, desiredID) signature for each passed argument
        eachArgument : function (objectWithIds, objectsWithOutIDs, func, scope) {
            Joose.O.each(objectWithIds      || {}, func, scope || this)
            
            Joose.A.each(objectsWithOutIDs  || [], function (argument) {
                
                func.call(scope || this, argument)
            })
        },
        
        
        collapse : function (objectWithIds, objectsWithOutIDs) {
            // sanity checks 
            
            var objectsCounter = 0
            
            this.eachArgument(objectWithIds, objectsWithOutIDs, function (argument) {
                if (argument == null || (typeof argument != 'object' && typeof argument != 'function') ) throw "Invalid argument [" + argument + "]  to 'collapse'. Can only collapse objects, not values."
                
                objectsCounter++
            })
            
            if (!objectsCounter) throw "Invalid arguments to 'collapse' - no objects to collapse"

            
            // recurse through the graph, accumulating nodes and counting refs
            
            this.visit(objectWithIds, objectsWithOutIDs)
            

            // assume all passed objects are first class, so we need to acquire IDs for them
            
            var nodes               = this.nodes
            var firstClassNodes     = []
            
            this.eachArgument(objectWithIds, objectsWithOutIDs, function (argument, desiredId) {
                var node = nodes[ argument.__REFADR__ ]
                
                node.acquireID(desiredId)
                node.isRoot = true
            })


            // also marks shared nodes (refCount > 1) and Joose instances (unless intrinsic) as first class (if we are in compact mode) 
            
            var refCounts           = this.refCounts
            
            Joose.O.each(nodes, function (node, refadr) {
                
                if ( (node.isRoot || refCounts[ refadr ] > 1 || Joose.O.isInstance(node.object)) && !node.typeMap.intrinsic || !this.compact) {
                    // this makes this node `firstClass` (but not root)
                    if (!node.isFirstClass()) node.acquireID()
                    
                    firstClassNodes.push(node)
                }
            }, this)
            
            
            return firstClassNodes
        },
     
        
        visitArray : function (instance, className) {
            return this.visitObject(instance, className)
        },
        
        
        visitObject : function (instance, className) {
            var typeMap         = this.getTypeMapFor(className)
            
            // need to create the node before recursing through the instance's data, to handle circular-references correctly
            var node            = this.createNode(instance, typeMap, className)
            
            // now that node is already in the `this.nodes` we can collect the data
            typeMap.collapse(instance, node, this)
            
            return node
        },
        
        
        createNode : function (object, typeMap, className) {
            
            var backend     = this.backend
            var nodeClass   = backend.nodeClass
            
            return this.nodes[ object.__REFADR__ ] = new nodeClass({
                object      : object,
                className   : className,
                
                typeMap     : typeMap,
                backend     : backend
            })
        }
    }

})


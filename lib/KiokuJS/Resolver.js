Class('KiokuJS.Resolver', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        entries             : Joose.I.Array,
        
        parent              : null,
        
        cache               : Joose.I.Object,
        
        classesFetched      : false
    },
    
    
    methods : {
        
        BUILD   : function (param) {
            if (param instanceof Array) return {
                entries : param
            }
            
            return this.SUPERARG(arguments)
        },
        
        
        initialize : function () {
            
            var entries     = this.entries
            
            Joose.A.each(entries, function (entry, index) {
                    
                entries[ index ] = this.prepareEntry(entry)
                
            }, this)
        },
        
        
        prepareEntry : function (entry) {
            if (!entry) throw "Can't add empty entry to resolver : " + this
            
            if (!Joose.O.isInstance(entry)) {
                var entryClass = eval(entry.meta)
                delete entry.meta
                
                entry = new entryClass(entry)
            }
            
            if (entry instanceof KiokuJS.Resolver) entry.parent = this 
            
            return entry
        },
        

        //XXX implement full CRUD for entries
        addEntry : function (entry) {
            this.entries.push(this.prepareEntry(entry))
            
            this.discardCache()
        },
        
        
        getEntryAt : function (index) {
            return this.entries[ index ]
        },
        
        
        discardCache : function () {
            this.cache              = {}
            this.classesFetched     = false
            
            if (this.parent) this.parent.discardCache()
        },
        
        
        each : function (func, scope) {
            scope = scope || this
            
            return Joose.A.each(this.entries, function (entry) {
                
                if (entry instanceof KiokuJS.Resolver) 
                    return entry.each(func, scope)
                else 
                    return func.call(scope, entry)
            })
        },
        
        
        resolveSingle : function (className) {
            var cache = this.cache
            
            if (cache[ className ]) return cache[ className ]
            
            var typeMap
            
            this.each(function (entry) {
                
                if (entry instanceof KiokuJS.Resolver) { 
                    typeMap = entry.resolveSingle(className)
                    
                    if (typeMap) return false
                } else 
                    if (entry instanceof KiokuJS.TypeMap) { 
                        
                        if (entry.canHandle(className)) {
                            typeMap = entry
                            
                            return false
                        }
                    } else
                        throw "Invalid entry [" + entry + "] in resolver + [" + this + "]"
            })
            
            if (typeMap) return cache[ className ] = typeMap
        },
        
        
        resolveMulti : function (classNames) {
            return Joose.A.map(classNames, this.resolveSingle, this)
        }
        
    },
    
    
    continued : {
        
        methods : {
        

            fetchClasses : function () {
                if (this.classesFetched) {
                    this.CONTINUE()
                    
                    return
                }
                
                
                var classes = []
                
                this.each(function (entry) {
                    classes.push.apply(classes, entry.getRequiredClasses())
                })

                
                var me      = this
                var CONT    = this.CONT
                
                use(classes, function () {
                    me.classesFetched = true
                    
                    CONT.CONTINUE()
                })
            },

            
            resolve : function (classNames) {
                (this.classesFetched ? this : this.fetchClasses()).andTHEN(function () {
                    
                    this.CONTINUE(this.resolveMulti(classNames))
                })
            }
        }
    }

})

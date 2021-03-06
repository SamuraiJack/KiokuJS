Role('KiokuJS.Feature.Attribute.Lazy', {
    
    does    : 'KiokuJS.Aspect.AfterCollapse',
    
    
    use     : 'JooseX.CPS',
    
    
    after : {
        
        afterCollapse : function (instance, value) {
            
            if (value instanceof KiokuJS.Node) value.lazy = true
        },
        
        
        initialize : function () {
            this.readable = this.hasGetter = true
        }
    },
    
    
    override : {
        
        getGetter : function () {
            var original    = this.SUPER()
            
            var me          = this
            
            return function (scope) {
                var value   = original.call(this)
                var self    = this
                
                var cont = Joose.top.__GLOBAL_CNT__ || new JooseX.CPS.Continuation()
                
                if (value instanceof KiokuJS.Reference && value.type == 'lazy') {
                    
                    var ID = value.ID
                    
                    if (!scope) throw "No scope provided to fetch the lazy reference in. Reference ID [" + ID + "]"
                    
                    return cont.TRY(function () {
                        
                        scope.lookUp(ID).andThen(function (obj) {
                            
                            me.setRawValueTo(self, obj)
                            
                            this.CONT.CONTINUE(obj)
                        }, self)
                    }, self)
                }
                
                return cont.TRY(function () { 
                    this.CONT.CONTINUE(value) 
                }, self)    
            }
        }
    }
})

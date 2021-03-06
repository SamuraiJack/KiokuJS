Class('KiokuJS.Resolver.Standard', {
    
    isa         : 'KiokuJS.Resolver',
    
    
    use         : [
        'KiokuJS.TypeMap.Role.NoDeps',
    
        'KiokuJS.TypeMap.Joose',
        
        'KiokuJS.TypeMap.Object',
        'KiokuJS.TypeMap.Array',
        
        'KiokuJS.TypeMap.Function',
        'KiokuJS.TypeMap.Date'
    ],
    

    
    after : {
        
        initialize : function () {
            
            // the order matter
            
            this.addEntry(new KiokuJS.TypeMap.Joose({
                trait   : KiokuJS.TypeMap.Role.NoDeps,
                
                inherit : true
            }))
            
            this.addEntry(new KiokuJS.TypeMap.Object())
            
            this.addEntry(new KiokuJS.TypeMap.Array())
            
            this.addEntry(new KiokuJS.TypeMap.Function())
            
            this.addEntry(new KiokuJS.TypeMap.Date())
        }
    }

})

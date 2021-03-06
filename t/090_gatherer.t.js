StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Linker.RefGatherer,   "'KiokuJS.Linker.RefGatherer' is here")
    t.ok(KiokuJS.Reference,         "'KiokuJS.Reference' is here")

    
    //======================================================================================================================================================================================================================================================
    t.diag('Setup')
    
    var ref1 = {
        $ref    : '123'
    }
    
    var ref2 = {
        $ref    : '456'
    }
    
    
    var graph = {
        
        foo : ref1,
        
        bar : [ ref1, ref2 ]
    }
    
    
    var references = KiokuJS.Linker.RefGatherer.gatherReferences(graph)
    
    t.ok(references.length == 2, 'Correct number of references returned')
    
    references.sort()
    
    t.ok(references[0] == '123', 'Correct reference found #1')
    t.ok(references[1] == '456', 'Correct reference found #2')
    
    t.done()
})    
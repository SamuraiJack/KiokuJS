var Harness

if (typeof process != 'undefined' && process.pid) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
Harness.configure({
    title : 'KiokuJS Test Suite',
    
    autoGlobalsCheck    : true,
    
//    transparentEx : true,
    
    preload : [
        '../kiokujs-test.js'
    ]
})


Harness.start(
    '010_sanity.t.js',
    '030_resolver.t.js',
    
    '050_collapser.t.js',
    '051_collapser_shallow.t.js',
    '052_collapser_intrinsic.t.js',
    
    '060_encoder.t.js',
    '061_encoder_intrinsic.t.js',
    '062_encoder_reserved_keys.t.js',
    '063_encoder_intrinsic_native.t.js',
    
    '070_decoder.t.js',
    '071_decoder_intrinsic.t.js',
    '072_decoder_reserved_keys.t.js',
    
    '080_expander.t.js',
    '081_expander_intrinsic.t.js',
    '082_expander_reserved_keys.t.js',
    
    '090_gatherer.t.js',
    
    '100_backend_hash_sanity.t.js',
    '101_backend_packets.t.js',
    
    '110_fixture_object_graph.t.js',
    '120_fixture_traits.t.js',
    '130_fixture_update.t.js',
    '131_fixture_refresh.t.js',
    '140_fixture_remove.t.js',
    '150_fixture_intrinsic.t.js',
    '160_fixture_immutable.t.js',
    '170_fixture_proxy.t.js',
    '180_fixture_animate_packet.t.js',
    '190_fixture_lazy.t.js',
    
    '200_fixture_feature_overwrite.t.js',
    '300_fixture_stressload_tree.t.js'
)

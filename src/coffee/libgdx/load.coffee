System.import('gdx').then((gdx) ->
    console.log('gdx loaded')
    window['gdx'] = gdx.default
, (err) ->
    console.log(err)
)

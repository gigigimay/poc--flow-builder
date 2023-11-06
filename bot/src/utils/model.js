import * as fp from '@appman/mac_modules/fp'

export const createModel = fp.pipe(
  fp.traverse(
    fp.pipe(
      fp.when(fp.has('path'), (config, path, obj) =>
        fp.pipe(
          fp.set('key', config.path),
          fp.set('path', `${obj.base}.${config.path}`)
        )(config))
    )
  )
)

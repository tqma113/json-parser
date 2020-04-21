import parse from '../src/parse'

describe('json parser', () => {
    describe('string parse', () => {
        it('matchValue', () => {
            const jsonStr = `{
                "compilerOptions": {
                  "baseUrl": ".",
                  "outDir": "lib",
                  "declaration": true,
                  "sourceMap": false,
                  "target": "es5",
                  "module": "commonjs",
                  "skipLibCheck": true,
                  "allowSyntheticDefaultImports": true,
                  "moduleResolution": "node",
                  "allowJs": false,
                  "noUnusedLocals": false,
                  "strict": true,
                  "noImplicitAny": true,
                  "noImplicitReturns": true,
                  "preserveConstEnums": true,
                  "noImplicitThis": true,
                  "resolveJsonModule": true,
                  "esModuleInterop": true,
                  "removeComments": false,
                  "lib": [
                    "esnext"
                  ],
                  "types": [
                    "jest",
                    "node"
                  ],
                  "rootDir": "."
                },
                "include": [
                  "src"
                ]
              }`
            const json = parse(jsonStr)
            expect(json).toStrictEqual({
                "compilerOptions": {
                  "baseUrl": ".",
                  "outDir": "lib",
                  "declaration": true,
                  "sourceMap": false,
                  "target": "es5",
                  "module": "commonjs",
                  "skipLibCheck": true,
                  "allowSyntheticDefaultImports": true,
                  "moduleResolution": "node",
                  "allowJs": false,
                  "noUnusedLocals": false,
                  "strict": true,
                  "noImplicitAny": true,
                  "noImplicitReturns": true,
                  "preserveConstEnums": true,
                  "noImplicitThis": true,
                  "resolveJsonModule": true,
                  "esModuleInterop": true,
                  "removeComments": false,
                  "lib": [
                    "esnext"
                  ],
                  "types": [
                    "jest",
                    "node"
                  ],
                  "rootDir": "."
                },
                "include": [
                  "src"
                ]
              })
        })

    })
})
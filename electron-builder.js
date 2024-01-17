// electron-builder

let productName = '安娜';
let appId = 'com.nana.serviceG';
let nsisScript = 'build_resources/nsis/installer.nsi';

if (process.env.NODE_ENV == 'staging') {
  productName = '安娜公测';
  appId = 'com.nana.staging.serviceG';
  nsisScript = 'build_resources/nsis/installer-staging.nsi';
} else if (process.env.NODE_ENV == 'test') {
  productName = '安娜内测';
  appId = 'com.nana.test.serviceG';
  nsisScript = 'build_resources/nsis/installer-test.nsi';
}

let baseConfig = {
  productName,
  appId,
  copyright: 'Copyright © 2022 ${author}',
  directories: {
    output: 'build'
  },
  publish: [
    {
      provider: 'generic',
      channel: 'latest',
      url: ''
    }
  ],
  asar: true,
  artifactName: '${name}-${version}.${ext}',
  compression: 'maximum',
  afterPack: 'script/hook/afterPackHook.js',
  afterSign: 'script/hook/afterSignHook.js',
  afterAllArtifactBuild: 'script/hook/afterAllArtifactBuild.js',
  dmg: {
    sign: false,
    writeUpdateInfo: false,
    background: 'build_resources/mac/dmg_bg.tiff',
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ]
  },
  nsis: {
    oneClick: false,
    warningsAsErrors: false,
    unicode: true,
    differentialPackage: false,
    deleteAppDataOnUninstall: true,
    installerIcon: 'build_resources/win/logo.ico',
    uninstallerIcon: 'build_resources/win/uninst.ico',
    script: nsisScript
  },
  mac: {
    icon: 'build_resources/icons/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build_resources/mac/entitlements.mac.plist',
    entitlementsInherit: 'build_resources/mac/entitlements.mac.inherit.plist',
    target: ['dmg', 'zip'],
    electronLanguages: ['zh_CN']
  },
  win: {
    icon: 'build_resources/win/logo.ico',
    signingHashAlgorithms: ['sha256'],
    target: [
      {
        target: 'nsis',
        arch: ['ia32']
      }
    ],
    verifyUpdateCodeSignature: false
  },
  protocols: [
    {
      name: 'nanaqjkhdg',
      schemes: ['nanaqjkhdg']
    }
  ]
};

module.exports = baseConfig;

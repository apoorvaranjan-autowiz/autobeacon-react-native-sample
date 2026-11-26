package com.autobeaconreactnativesample

import android.app.Application
import com.autobeaconreactnative.AutoBeaconRNModule
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  @Deprecated(
    "You should not use ReactNativeHost directly in the New Architecture. Use ReactHost instead.",
    replaceWith = ReplaceWith("reactHost")
  )
  @Suppress("DEPRECATION")
  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages

      override fun getJSMainModuleName(): String = "index"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

      override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

      @Deprecated(
        "Setting isHermesEnabled inside `ReactNativeHost` is deprecated and this field will be ignored. If this field is set to true, you can safely remove it. If this field is set to false, please follow the setup on https://github.com/react-native-community/javascriptcore to continue using JSC",
        replaceWith = ReplaceWith("")
      )
      override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }

    AutoBeaconRNModule.setContext(applicationContext)
  }
}

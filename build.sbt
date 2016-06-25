scalaJSUseRhino in Global := false

enablePlugins(ScalaJSPlugin)

name := "Invaders"

scalaVersion := "2.11.7"

libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.9.0"

skip in packageJSDependencies := false

jsDependencies += "org.webjars.bower" % "system.js" % "0.19.17" / "dist/system.js"
jsDependencies += "org.webjars" % "pixi.js" % "3.0.7" / "pixi.js"  dependsOn "dist/system.js"
jsDependencies += ProvidedJS / "libgdx.js" dependsOn "pixi.js"
jsDependencies += ProvidedJS / "overlap2d-runtime-libgdx.js" dependsOn "libgdx.js"
jsDependencies += RuntimeDOM

libraryDependencies += "com.darkoverlordofdata" %%% "entitas" % "0.0.0-SNAPSHOT"

persistLauncher in Compile := true



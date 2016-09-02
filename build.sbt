scalaJSUseRhino in Global := false

enablePlugins(ScalaJSPlugin)

name := "ShmupWarz"

scalaVersion := "2.11.7"


resolvers ++= Seq(
    "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots/",
    "Sonatype OSS Releases" at "https://oss.sonatype.org/content/repositories/releases/")

libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.9.0"
libraryDependencies += "com.darkoverlordofdata" %%% "entitas" % "0.0.0-SNAPSHOT"

skip in packageJSDependencies := false

jsDependencies += "org.webjars" % "pixi.js" % "3.0.7" / "pixi.js"   
jsDependencies += ProvidedJS / "amd.js"                             dependsOn "pixi.js"
jsDependencies += ProvidedJS / "externals.js"                       dependsOn "amd.js"
jsDependencies += RuntimeDOM


persistLauncher in Compile := true



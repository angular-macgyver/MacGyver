#!/usr/bin/env node

child   = require "child_process"
util    = require "util"
fs      = require "fs"

GIT_LOG = "git log --grep='%s' -E --format=%s %s..HEAD"
GIT_TAG = "git describe --tags --abbrev=0"
GIT_GREP = "^fix|^feature|^refactor|BREAKING"

githubUrl = "https://github.com/StartTheShift/MacGyver"

issueLink = "[#%s](#{githubUrl}/issues/%s)"
commitLink = "[%s](#{githubUrl}/commit/%s)"

displayText =
  fix:      "Bug Fixes"
  feature:  "Features"
  breaking: "Breaking Changes"
  refactor: "Optimizations"

linkToIssue  = (issue) -> util.format issueLink, issue, issue
linkToCommit = (hash) -> util.format commitLink, hash.substr(0, 8), hash

parseCommit = (log) ->
  return unless log? and log

  commit    = log.split "\n"
  commitObj =
    type:      ""
    component: ""
    message:   ""
    hash:      commit.shift()
    issues:    []
    title:     commit.shift()

  newCommit = []
  for line in commit
    if match = line.match /(?:Closes|Fixes)\s#(\d+)/
      commitObj.issues.push parseInt(match[1])
    else
      newCommit.push line
  commit = newCommit

  message = commit.join " "
  if match = commitObj.title.match /^([^\(]+)\(([\w\.]+)\):\s+(.+)/
    commitObj.type      = match[1]
    commitObj.component = match[2]
    commitObj.message   = match[3]
    commitObj.message  += "\n" + message if message

  if match = message.match /BREAKING CHANGE[S]?:?([\s\S]*)/
    commitObj.type    = "breaking"
    commitObj.message = match[1]

  return commitObj

readGitLog = (grep, from, callback) ->
  child.exec(
    util.format(GIT_LOG, grep, "%H%n%s%n%b%n==END==", from),
    (error, stdout, stderr) ->
      return callback error, "" if error?

      commits = []
      if stdout
        commits = (commit for commit in stdout.split("\n==END==\n"))
      commits.pop()
      callback error, commits
  )

getLastVersion = (callback) ->
  child.exec GIT_TAG, (error, stdout, stderr) ->
    data = if error? then "" else stdout.replace("\n", "")
    callback error, data

writeChangeLog = (stream, commits, version) ->
  sections =
    fix:      {}
    feature:  {}
    refactor: {}
    breaking: {}

  for commit in commits
    section = sections[commit.type]

    continue unless section?

    section[commit.component] ?= []
    section[commit.component].push commit

  today  = new Date()
  stream.write "# #{version} (#{today.getFullYear()}/#{today.getMonth() + 1}/#{today.getDate()})\n"
  for sectionType, list of sections
    components = Object.getOwnPropertyNames(list).sort()

    continue unless components.length

    stream.write "## #{displayText[sectionType]}\n"

    for componentName in components
      prefix   = "-"
      multiple = list[componentName].length > 1

      if multiple
        stream.write util.format "- **%s:**\n", componentName
        prefix  = "  -"
      else
        prefix = util.format "- **%s:**", componentName

      for item in list[componentName]
        stream.write util.format "%s %s\n  (%s", prefix, item.message, linkToCommit(item.hash)
        if item.issues.length
          stream.write ",\n   #{item.issues.map(linkToIssue).join(", ")}"
        stream.write ")\n"

    stream.write "\n"

  stream.write "\n"

generate = (toTag, file, fromTag) ->
  getLastVersion (error, lastTag) ->
    return console.log "Failed to get last tag" if error?

    tag = fromTag or lastTag
    console.log "Reading commits since #{tag}"

    readGitLog GIT_GREP, tag, (error, commits) ->
      return console.log error if error?

      parsedCommits = (parseCommit commit for commit in commits)

      console.log "Parsed #{parsedCommits.length} commit(s)"

      stream = if file then fs.createWriteStream(file) else process.stdout
      writeChangeLog stream, parsedCommits, toTag

      console.log "Generated changelog to", file or "stdout", "(#{toTag})"

generate process.argv[2], process.argv[3], process.argv[4]

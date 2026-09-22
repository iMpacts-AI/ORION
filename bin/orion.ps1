[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ScriptArgs
)

& node "$PSScriptRoot\orion.js" @ScriptArgs

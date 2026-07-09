#!/usr/bin/env bash
# Shared helpers for bold's bash collector scripts.

json_escape() {
  # Escapes backslash/quote first (order matters), then newlines, CR, and
  # tabs -- found via compose-layers.sh, the first caller to ever pass
  # multi-line content (backbone.md fragments) through this helper.
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g; s/\r/\\r/g; s/\t/\\t/g'
}

json_array() {
  local parts=()
  for item in "$@"; do
    parts+=("\"$(json_escape "$item")\"")
  done
  if [ "${#parts[@]}" -eq 0 ]; then
    echo "[]"
  else
    (IFS=,; echo "[${parts[*]}]")
  fi
}

# Emits a JSON array of repo-relative paths under bold-docs/system/
collect_system_docs() {
  local repo_root="$1"
  local docs_dir="$2"
  local files=()
  if [ -d "$docs_dir/system" ]; then
    mapfile -t files < <(find "$docs_dir/system" -type f ! -name '.gitkeep' | sed "s|^$repo_root/||" | sort)
  fi
  json_array "${files[@]}"
}

# Emits a JSON array of {principle,reason,ratified_by,date}, one per
# `- Waiver: ...` line in the given spec file. See source/commands/WAIVERS.md
# for the line format.
collect_waivers_for_spec() {
  local spec="$1"
  local entries=()
  local line principle reason ratified_by date
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    principle="$(printf '%s' "$line" | sed -E 's/.*principle=([0-9]+).*/\1/')"
    reason="$(printf '%s' "$line" | sed -E 's/.*reason="([^"]*)".*/\1/')"
    ratified_by="$(printf '%s' "$line" | sed -E 's/.*ratified_by="([^"]*)".*/\1/')"
    date="$(printf '%s' "$line" | sed -E 's/.*date=([0-9-]+).*/\1/')"
    entries+=("{\"principle\":${principle:-null},\"reason\":\"$(json_escape "$reason")\",\"ratified_by\":\"$(json_escape "$ratified_by")\",\"date\":\"$(json_escape "$date")\"}")
  done < <(grep -oE '^- Waiver: .*' "$spec" 2>/dev/null; printf '\n')
  if [ "${#entries[@]}" -eq 0 ]; then
    echo "[]"
  else
    (IFS=,; echo "[${entries[*]}]")
  fi
}

# Emits a JSON array of {id,status,tier,waivers}, one per
# bold-docs/features/*/spec.md
collect_active_features() {
  local docs_dir="$1"
  local entries=()
  if [ -d "$docs_dir/features" ]; then
    for dir in "$docs_dir/features"/*/; do
      [ -d "$dir" ] || continue
      local id spec status tier waivers
      id="$(basename "$dir")"
      spec="$dir/spec.md"
      [ -f "$spec" ] || continue
      status="$(sed -n 's/^\*\*Status\*\*: //p' "$spec" | head -1)"
      tier="$(sed -n 's/^\*\*Tier\*\*: //p' "$spec" | head -1)"
      waivers="$(collect_waivers_for_spec "$spec")"
      entries+=("{\"id\":\"$(json_escape "$id")\",\"status\":\"$(json_escape "${status:-unknown}")\",\"tier\":\"$(json_escape "${tier:-unknown}")\",\"waivers\":$waivers}")
    done
  fi
  if [ "${#entries[@]}" -eq 0 ]; then
    echo "[]"
  else
    (IFS=,; echo "[${entries[*]}]")
  fi
}

# Emits a JSON array of {n,status}, one per numbered principle in backbone.md
collect_backbone_principles() {
  local docs_dir="$1"
  local backbone_file="$docs_dir/backbone.md"
  local entries=()
  local n=0
  if [ -f "$backbone_file" ]; then
    while IFS= read -r status; do
      [ -n "$status" ] || continue
      n=$((n+1))
      entries+=("{\"n\":$n,\"status\":\"$(json_escape "$status")\"}")
    done < <(sed -n 's/^[[:space:]]*\*\*Status\*\*: //p' "$backbone_file"; printf '\n')
  fi
  if [ "${#entries[@]}" -eq 0 ]; then
    echo "[]"
  else
    (IFS=,; echo "[${entries[*]}]")
  fi
}

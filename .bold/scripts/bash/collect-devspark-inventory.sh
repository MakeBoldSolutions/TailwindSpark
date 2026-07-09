#!/usr/bin/env bash
# Collector for bold.plan init's Migrate path. Inventories a DevSpark
# install so the migration report prompt reasons over structured ground
# truth instead of re-deriving it by hand. First cut, built against a real
# DevSpark repo's actual shape (constitution.md's "### {roman}. Name" headers
# under "## Core Principles"; .documentation/specs/{name}/ as the feature-dir
# location) -- expect this to need refinement once real migrations are run
# (bold-tool-plan.md §15's crucible feedback loop).
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=./lib/common.sh
source "$script_dir/lib/common.sh"

devspark_dir="$repo_root/.devspark"
has_devspark_dir=false
devspark_file_count=0
if [ -d "$devspark_dir" ]; then
  has_devspark_dir=true
  devspark_file_count="$(find "$devspark_dir" -type f | wc -l | tr -d ' ')"
fi

docs_dir="$repo_root/.documentation"
has_documentation_dir=false
[ -d "$docs_dir" ] && has_documentation_dir=true

constitution_path="$docs_dir/memory/constitution.md"
has_constitution=false
principle_count=0
if [ -f "$constitution_path" ]; then
  has_constitution=true
  principle_count="$(awk '
    /^## Core Principles/ { in_section=1; next }
    in_section && /^## / { exit }
    in_section && /^### / { count++ }
    END { print count+0 }
  ' "$constitution_path")"
fi

team_scripts_dir="$docs_dir/scripts"
has_team_scripts_override=false
team_scripts_files=()
if [ -d "$team_scripts_dir" ]; then
  has_team_scripts_override=true
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    team_scripts_files+=("${f#"$team_scripts_dir"/}")
  done < <(find "$team_scripts_dir" -type f)
fi

specs_dir="$docs_dir/specs"
spec_entries=()
if [ -d "$specs_dir" ]; then
  while IFS= read -r dir; do
    [ -n "$dir" ] || continue
    name="$(basename "$dir")"
    count="$(find "$dir" -type f | wc -l | tr -d ' ')"
    spec_entries+=("{\"name\":\"$(json_escape "$name")\",\"file_count\":$count}")
  done < <(find "$specs_dir" -mindepth 1 -maxdepth 1 -type d)
fi
spec_dirs_json="[$(IFS=,; echo "${spec_entries[*]}")]"
[ "${#spec_entries[@]}" -eq 0 ] && spec_dirs_json="[]"

# Multi-app config: named devspark.json per bold-tool-plan.md's own mapping
# table; not every repo has one (single-app is the common case).
multi_app_config_path="$repo_root/devspark.json"
has_multi_app_config=false
[ -f "$multi_app_config_path" ] && has_multi_app_config=true

printf '{"has_devspark_dir":%s,"devspark_dir_file_count":%s,"has_documentation_dir":%s,"has_constitution":%s,"constitution_principle_count":%s,"has_team_scripts_override":%s,"team_scripts_files":%s,"spec_dirs":%s,"has_multi_app_config":%s}' \
  "$has_devspark_dir" "$devspark_file_count" "$has_documentation_dir" "$has_constitution" \
  "$principle_count" "$has_team_scripts_override" "$(json_array "${team_scripts_files[@]}")" \
  "$spec_dirs_json" "$has_multi_app_config"

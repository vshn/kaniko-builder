# Kaniko Builder

This repository builds a custom Kaniko Docker image. It currently utilizes a
fork from Chainguard: [chainguard-dev/kaniko](https://github.com/chainguard-dev/kaniko).

## Updates

A grace period follows the release of a new Kaniko tag. After this period,
[Renovate](https://www.mend.io/renovate/) creates a Pull Request to update the
tag referenced in
[`build-and-push-nightly.yaml`](.github/workflows/build-and-push-nightly.yaml).

Patches are automatically merged, while all other updates require manual merging.
The `nightly-debug` tag is then used by VSHN's internal tools.

Following a similar grace period, the `debug-nightly` tag is re-tagged as
`debug` (see [`push-stable.yaml`](.github/workflows/push-stable.yaml)). The
`debug` tag is subsequently used for VSHN's [AppFlow](https://www.vshn.ch/en/solutions/appflow/)
customers and other products.

### Stopping the Rollout

Should a problem be detected with the `debug-nightly` tag, or even with the
upstream fork, automatic updates can be paused via the
[Renovate settings for this repository](https://developer.mend.io/github/vshn/kaniko-builder/-/settings).

### Rolling Out Security Fixes

For expedited security fixes, it's possible to manually update the tag and SHA
to be published by the [`push-stable.yaml`](.github/workflows/push-stable.yaml)
workflow. The relevant SHA can be found here:
[ghcr.io/vshn/kaniko:nightly-debug](https://github.com/vshn/kaniko-builder/pkgs/container/kaniko/540389170?tag=nightly-debug).

## GitHub Actions

GitHub Actions are pinned to their specific SHAs to ensure that updates are
explicit.

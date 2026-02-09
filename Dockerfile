ARG IMAGE_PROJECT=vshn
ARG VERSION=nightly-debug

FROM alpine:3.23.3 AS builder

# renovate: datasource=github-releases depName=kubernetes/kubernetes
ENV KUBECTL_VERSION=v1.35.0

RUN URL="https://dl.k8s.io/${KUBECTL_VERSION}/kubernetes-client-linux-amd64.tar.gz" \
    && wget -q -O /tmp/kubectl.tgz $URL \
    && SHA256SUM=$(wget -q -O - "${URL}.sha256") \
    && echo "${SHA256SUM}  /tmp/kubectl.tgz" > /tmp/CHECKSUM \
    && sha256sum -c /tmp/CHECKSUM \
    && tar -xzvf /tmp/kubectl.tgz \
    && mv kubernetes/client/bin/kubectl /bin/kubectl

FROM ghcr.io/$IMAGE_PROJECT/kaniko:$VERSION

COPY --from=builder /bin/kubectl /usr/local/bin/kubectl

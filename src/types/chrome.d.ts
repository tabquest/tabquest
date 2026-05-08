declare namespace chrome {
  namespace runtime {
    interface Manifest {
      version: string;
      name: string;
      description?: string;
      manifest_version?: number;
    }

    function getManifest(): Manifest;
  }
}

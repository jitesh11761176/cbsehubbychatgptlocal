provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_storage_bucket" "uploads" {
  name          = "${var.project_id}-cbsehub-uploads"
  location      = var.region
  force_destroy = true
}
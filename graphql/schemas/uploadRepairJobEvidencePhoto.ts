import gql from 'graphql-tag';

export const UPLOAD_REPAIR_JOB_EVIDENCE_PHOTO = gql`
  mutation UploadRepairJobEvidencePhoto($repairJobId: ID!, $file: Upload!, $photoEvidencePhase: String!) {
    uploadRepairJobEvidencePhoto(repairJobId: $repairJobId, file: $file, photoEvidencePhase: $photoEvidencePhase) {
      id
      beforePhotoUrl
      afterPhotoUrl
    }
  }
`;

namespace EduSyncWebAPI.DTO
{
    public class ResultDTO
    {
        public Guid ResultId { get; set; }

        public Guid? AssessmentId { get; set; }

        public Guid? UserId { get; set; }

        public int? Score { get; set; }

        public DateOnly? AttemptDate { get; set; }
    }
}

export interface DefaultSubscriberSkillResponseDto {
    id: string;
    name: string;
}

export interface DefaultSubscriberResponseDto {
    id: string;
    email: string;
    skills: DefaultSubscriberSkillResponseDto[];
}

export interface CreateSubscriberRequestDto {
    skills?: string[];
}

export interface UpdateSubscriberRequestDto extends CreateSubscriberRequestDto {}

export interface DefaultSubscriberRequestDto {
    skills: string[];
}

export default interface SignUpRequestDto {

    email: string;
    password: string;
    nickname: string;
    telNumber: string;
    zonecode: string;
    address: string;
    addressDetail: string | null;
    agreedPersonal: boolean;
}